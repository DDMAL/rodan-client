/* */ 
"use strict";
var Q = require('q');
var URL = require('./browser-url');
var Identifier = require('./identifier');
var Module = require('./module');
var Resource = require('./resource');
var parseDependencies = require('./parse-dependencies');
var compile = require('./compile');
var has = Object.prototype.hasOwnProperty;
module.exports = System;
function System(location, description, options) {
  var self = this;
  options = options || {};
  description = description || {};
  self.name = description.name || '';
  self.location = location;
  self.description = description;
  self.dependencies = {};
  self.main = null;
  self.resources = options.resources || {};
  self.modules = options.modules || {};
  self.systemLocations = options.systemLocations || {};
  self.systems = options.systems || {};
  self.systemLoadedPromises = options.systemLoadedPromises || {};
  self.buildSystem = options.buildSystem;
  self.analyzers = {js: self.analyzeJavaScript};
  self.compilers = {
    js: self.compileJavaScript,
    json: self.compileJson
  };
  self.translators = {};
  self.internalRedirects = {};
  self.externalRedirects = {};
  self.node = !!options.node;
  self.browser = !!options.browser;
  self.parent = options.parent;
  self.root = options.root || self;
  self.systems[self.name] = self;
  self.systemLocations[self.name] = self.location;
  self.systemLoadedPromises[self.name] = Q(self);
  if (options.name != null && options.name !== description.name) {
    console.warn("Package loaded by name " + JSON.stringify(options.name) + " bears name " + JSON.stringify(description.name));
  }
  self.main = description.main || "index.js";
  self.internalRedirects[".js"] = "./" + Identifier.resolve(self.main, "");
  if (options.browser) {
    self.overlayBrowser(description);
  }
  if (options.node) {
    self.overlayNode(description);
  }
  if (description.dependencies) {
    self.addDependencies(description.dependencies);
  }
  if (self.root === self && description.devDependencies) {
    self.addDependencies(description.devDependencies);
  }
  if (description.redirects) {
    self.addRedirects(description.redirects);
  }
  if (description.translators) {
    self.addTranslators(description.translators);
  }
  if (description.analyzers) {
    self.addAnalyzers(description.analyzers);
  }
  if (description.compilers) {
    self.addCompilers(description.compilers);
  }
}
System.load = function loadSystem(location, options) {
  var self = this;
  return self.prototype.loadSystemDescription(location).then(function(description) {
    return new self(location, description, options);
  });
};
System.prototype.import = function importModule(rel, abs) {
  var self = this;
  return self.load(rel, abs).then(function onModuleLoaded() {
    self.root.main = self.lookup(rel, abs);
    return self.require(rel, abs);
  });
};
System.prototype.require = function require(rel, abs) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  if (Identifier.isAbsolute(rel)) {
    if (self.externalRedirects[res] === false) {
      return {};
    }
    if (self.externalRedirects[res]) {
      return self.require(self.externalRedirects[res], res);
    }
    var head = Identifier.head(rel);
    var tail = Identifier.tail(rel);
    if (self.dependencies[head]) {
      return self.getSystem(head, abs).requireInternalModule(tail, abs);
    } else if (self.modules[head]) {
      return self.requireInternalModule(rel, abs, self.modules[rel]);
    } else {
      var via = abs ? " via " + JSON.stringify(abs) : "";
      throw new Error("Can't require " + JSON.stringify(rel) + via + " in " + JSON.stringify(self.name));
    }
  } else {
    return self.requireInternalModule(rel, abs);
  }
};
System.prototype.requireInternalModule = function requireInternalModule(rel, abs, module) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  var id = self.normalizeIdentifier(res);
  if (self.internalRedirects[id]) {
    return self.require(self.internalRedirects[id], id);
  }
  module = module || self.lookupInternalModule(id);
  if (module.error) {
    var error = module.error;
    var via = abs ? " via " + JSON.stringify(abs) : "";
    error.message = ("Can't require module " + JSON.stringify(module.id) + via + " in " + JSON.stringify(self.name || self.location) + " because " + error.message);
    throw error;
  }
  if (module.exports != null) {
    return module.exports;
  }
  if (typeof module.factory !== "function") {
    throw new Error("Can't require module " + JSON.stringify(module.filename) + ". No exports. No exports factory.");
  }
  module.require = self.makeRequire(module.id, self.root.main);
  module.exports = {};
  module.factory.call(null, module.require, module.exports, module, module.filename, module.dirname);
  return module.exports;
};
System.prototype.makeRequire = function makeRequire(abs, main) {
  var self = this;
  function require(rel) {
    return self.require(rel, abs);
  }
  ;
  require.main = main;
  return require;
};
System.prototype.getSystem = function getSystem(rel, abs) {
  var self = this;
  var hasDependency = self.dependencies[rel];
  if (!hasDependency) {
    var via = abs ? " via " + JSON.stringify(abs) : "";
    throw new Error("Can't get dependency " + JSON.stringify(rel) + " in package named " + JSON.stringify(self.name) + via);
  }
  var dependency = self.systems[rel];
  if (!dependency) {
    var via = abs ? " via " + JSON.stringify(abs) : "";
    throw new Error("Can't get dependency " + JSON.stringify(rel) + " in package named " + JSON.stringify(self.name) + via);
  }
  return dependency;
};
System.prototype.loadSystem = function(name, abs) {
  var self = this;
  var loadingSystem = self.systemLoadedPromises[name];
  if (!loadingSystem) {
    loadingSystem = self.actuallyLoadSystem(name, abs);
    self.systemLoadedPromises[name] = loadingSystem;
  }
  return loadingSystem;
};
System.prototype.loadSystemDescription = function loadSystemDescription(location) {
  var self = this;
  var descriptionLocation = URL.resolve(location, "package.json");
  return self.read(descriptionLocation, "utf-8", "application/json").then(function(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      error.message = error.message + " in " + JSON.stringify(descriptionLocation);
      throw error;
    }
  }, function(error) {
    error.message = "Can't load package " + JSON.stringify(name) + " at " + JSON.stringify(location) + " because " + error.message;
    throw error;
  });
};
System.prototype.actuallyLoadSystem = function(name, abs) {
  var self = this;
  var System = self.constructor;
  var location = self.systemLocations[name];
  if (!location) {
    var via = abs ? " via " + JSON.stringify(abs) : "";
    throw new Error("Can't load package " + JSON.stringify(name) + via + " because it is not a declared dependency");
  }
  var buildSystem;
  if (self.buildSystem) {
    buildSystem = self.buildSystem.actuallyLoadSystem(name, abs);
  }
  return Q.all([self.loadSystemDescription(location), buildSystem]).spread(function onDescriptionAndBuildSystem(description, buildSystem) {
    var system = new System(location, description, {
      parent: self,
      root: self.root,
      name: name,
      resources: self.resources,
      modules: self.modules,
      systems: self.systems,
      systemLocations: self.systemLocations,
      systemLoadedPromises: self.systemLoadedPromises,
      buildSystem: buildSystem,
      browser: self.browser,
      node: self.node
    });
    self.systems[system.name] = system;
    return system;
  });
};
System.prototype.getBuildSystem = function getBuildSystem() {
  var self = this;
  return self.buildSystem || self;
};
System.prototype.normalizeIdentifier = function(id) {
  var self = this;
  var extension = Identifier.extension(id);
  if (!has.call(self.translators, extension) && !has.call(self.compilers, extension) && extension !== "js" && extension !== "json") {
    id += ".js";
  }
  return id;
};
System.prototype.load = function load(rel, abs, memo) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  if (Identifier.isAbsolute(rel)) {
    if (self.externalRedirects[res]) {
      return self.load(self.externalRedirects[res], res, memo);
    }
    var head = Identifier.head(rel);
    var tail = Identifier.tail(rel);
    if (self.dependencies[head]) {
      return self.loadSystem(head, abs).invoke("loadInternalModule", tail, "", memo);
    } else {
      return Q();
    }
  } else {
    return self.loadInternalModule(rel, abs, memo);
  }
};
System.prototype.loadInternalModule = function loadInternalModule(rel, abs, memo) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  var id = self.normalizeIdentifier(res);
  if (self.internalRedirects[id]) {
    return self.load(self.internalRedirects[id], "", memo);
  }
  var extension = Identifier.extension(res);
  var module = self.lookupInternalModule(id, abs);
  memo = memo || {};
  if (memo[module.key]) {
    return Q();
  }
  memo[module.key] = true;
  if (module.loadedPromise) {
    return module.loadedPromise;
  }
  module.loadedPromise = Q.try(function() {
    if (module.factory == null && module.exports == null) {
      return self.read(module.location, "utf-8").then(function(text) {
        module.text = text;
        return self.finishLoadingModule(module, memo);
      }, fallback);
    }
  });
  function fallback(error) {
    var redirect = Identifier.resolve("./index.js", res);
    module.redirect = redirect;
    if (!error || error.notFound && extension === "") {
      return self.loadInternalModule(redirect, abs, memo).catch(function(fallbackError) {
        module.redirect = null;
        module.error = error || fallbackError;
      });
    } else {
      module.error = error;
    }
  }
  return module.loadedPromise;
};
System.prototype.finishLoadingModule = function finishLoadingModule(module, memo) {
  var self = this;
  return Q.try(function() {
    return self.translate(module);
  }).then(function() {
    return self.analyze(module);
  }).then(function() {
    return Q.all(module.dependencies.map(function onDependency(dependency) {
      return self.load(dependency, module.id, memo);
    }));
  }).then(function() {
    return self.compile(module);
  }).catch(function(error) {
    module.error = error;
  });
};
System.prototype.lookup = function lookup(rel, abs) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  if (Identifier.isAbsolute(rel)) {
    if (self.externalRedirects[res]) {
      return self.lookup(self.externalRedirects[res], res);
    }
    var head = Identifier.head(res);
    var tail = Identifier.tail(res);
    if (self.dependencies[head]) {
      return self.getSystem(head, abs).lookupInternalModule(tail, "");
    } else if (self.modules[head] && !tail) {
      return self.modules[head];
    } else {
      var via = abs ? " via " + JSON.stringify(abs) : "";
      throw new Error("Can't look up " + JSON.stringify(rel) + via + " in " + JSON.stringify(self.location) + " because there is no external module or dependency by that name");
    }
  } else {
    return self.lookupInternalModule(rel, abs);
  }
};
System.prototype.lookupInternalModule = function lookupInternalModule(rel, abs) {
  var self = this;
  var res = Identifier.resolve(rel, abs);
  var id = self.normalizeIdentifier(res);
  if (self.internalRedirects[id]) {
    return self.lookup(self.internalRedirects[id], res);
  }
  var filename = self.name + '/' + id;
  var key = filename.toLowerCase();
  var module = self.modules[key];
  if (module && module.redirect) {
    return self.lookupInternalModule(module.redirect);
  }
  if (!module) {
    module = new Module();
    module.id = id;
    module.extension = Identifier.extension(id);
    module.location = URL.resolve(self.location, id);
    module.filename = filename;
    module.dirname = Identifier.dirname(filename);
    module.key = key;
    module.system = self;
    module.modules = self.modules;
    self.modules[key] = module;
  }
  if (module.filename !== filename) {
    module.error = new Error("Can't refer to single module with multiple case conventions: " + JSON.stringify(filename) + " and " + JSON.stringify(module.filename));
  }
  return module;
};
System.prototype.translate = function translate(module) {
  var self = this;
  if (module.text != null && module.extension != null && self.translators[module.extension]) {
    return self.translators[module.extension](module);
  }
};
System.prototype.addTranslators = function addTranslators(translators) {
  var self = this;
  var extensions = Object.keys(translators);
  for (var index = 0; index < extensions.length; index++) {
    var extension = extensions[index];
    var id = translators[extension];
    self.addTranslator(extension, id);
  }
};
System.prototype.addTranslator = function(extension, id) {
  var self = this;
  self.translators[extension] = self.makeTranslator(id);
};
System.prototype.makeTranslator = function makeTranslator(id) {
  var self = this;
  return function translate(module) {
    return self.getBuildSystem().import(id).then(function onTranslatorImported(translate) {
      if (typeof translate !== "function") {
        throw new Error("Can't translate " + JSON.stringify(module.id) + " because " + JSON.stringify(id) + " did not export a function");
      }
      module.extension = "js";
      return translate(module);
    });
  };
};
System.prototype.analyze = function analyze(module) {
  var self = this;
  if (module.text != null && module.extension != null && self.analyzers[module.extension]) {
    return self.analyzers[module.extension](module);
  }
};
System.prototype.analyzeJavaScript = function analyzeJavaScript(module) {
  var self = this;
  module.dependencies.push.apply(module.dependencies, parseDependencies(module.text));
};
System.prototype.compile = function(module) {
  var self = this;
  if (module.factory == null && module.redirect == null && module.exports == null && module.extension != null && self.compilers[module.extension]) {
    return self.compilers[module.extension](module);
  }
};
System.prototype.compileJavaScript = function compileJavaScript(module) {
  return compile(module);
};
System.prototype.compileJson = function compileJson(module) {
  module.exports = JSON.parse(module.text);
};
System.prototype.addCompilers = function addCompilers(compilers) {
  var self = this;
  var extensions = Object.keys(compilers);
  for (var index = 0; index < extensions.length; index++) {
    var extension = extensions[index];
    var id = compilers[extension];
    self.addCompiler(extension, id);
  }
};
System.prototype.addCompiler = function(extension, id) {
  var self = this;
  self.compilers[extension] = self.makeCompiler(id);
};
System.prototype.makeCompiler = function makeCompiler(id) {
  var self = this;
  return function compile(module) {
    return self.getBuildSystem().import(id).then(function(compile) {
      return compile(module);
    });
  };
};
System.prototype.getResource = function getResource(rel, abs) {
  var self = this;
  if (Identifier.isAbsolute(rel)) {
    var head = Identifier.head(rel);
    var tail = Identifier.tail(rel);
    return self.getSystem(head, abs).getInternalResource(tail);
  } else {
    return self.getInternalResource(Identifier.resolve(rel, abs));
  }
};
System.prototype.locateResource = function locateResource(rel, abs) {
  var self = this;
  if (Identifier.isAbsolute(rel)) {
    var head = Identifier.head(rel);
    var tail = Identifier.tail(rel);
    return self.loadSystem(head, abs).then(function onSystemLoaded(subsystem) {
      return subsystem.getInternalResource(tail);
    });
  } else {
    return Q(self.getInternalResource(Identifier.resolve(rel, abs)));
  }
};
System.prototype.getInternalResource = function getInternalResource(id) {
  var self = this;
  var filename = self.name + "/" + id;
  var key = filename.toLowerCase();
  var resource = self.resources[key];
  if (!resource) {
    resource = new Resource();
    resource.id = id;
    resource.filename = filename;
    resource.dirname = Identifier.dirname(filename);
    resource.key = key;
    resource.location = URL.resolve(self.location, id);
    resource.system = self;
    self.resources[key] = resource;
  }
  return resource;
};
System.prototype.addDependencies = function addDependencies(dependencies) {
  var self = this;
  var names = Object.keys(dependencies);
  for (var index = 0; index < names.length; index++) {
    var name = names[index];
    self.dependencies[name] = true;
    if (!self.systemLocations[name]) {
      var location = URL.resolve(self.location, "node_modules/" + name + "/");
      self.systemLocations[name] = location;
    }
  }
};
System.prototype.addRedirects = function addRedirects(redirects) {
  var self = this;
  var sources = Object.keys(redirects);
  for (var index = 0; index < sources.length; index++) {
    var source = sources[index];
    var target = redirects[source];
    self.addRedirect(source, target);
  }
};
System.prototype.addRedirect = function addRedirect(source, target) {
  var self = this;
  if (Identifier.isAbsolute(source)) {
    self.externalRedirects[source] = target;
  } else {
    source = self.normalizeIdentifier(Identifier.resolve(source));
    self.internalRedirects[source] = target;
  }
};
System.prototype.overlayBrowser = function overlayBrowser(description) {
  var self = this;
  if (typeof description.browser === "string") {
    self.addRedirect("", description.browser);
  } else if (description.browser && typeof description.browser === "object") {
    self.addRedirects(description.browser);
  }
};
System.prototype.inspect = function() {
  var self = this;
  return {
    type: "system",
    location: self.location
  };
};
