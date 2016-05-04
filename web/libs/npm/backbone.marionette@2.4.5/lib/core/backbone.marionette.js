/* */ 
"format cjs";
(function(process) {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['backbone', 'underscore', 'backbone.wreqr', 'backbone.babysitter'], function(Backbone, _) {
        return (root.Marionette = root.Mn = factory(root, Backbone, _));
      });
    } else if (typeof exports !== 'undefined') {
      var Backbone = require('backbone');
      var _ = require('underscore');
      var Wreqr = require('backbone.wreqr');
      var BabySitter = require('backbone.babysitter');
      module.exports = factory(root, Backbone, _);
    } else {
      root.Marionette = root.Mn = factory(root, root.Backbone, root._);
    }
  }(this, function(root, Backbone, _) {
    'use strict';
    var previousMarionette = root.Marionette;
    var previousMn = root.Mn;
    var Marionette = Backbone.Marionette = {};
    Marionette.VERSION = '2.4.5';
    Marionette.noConflict = function() {
      root.Marionette = previousMarionette;
      root.Mn = previousMn;
      return this;
    };
    Marionette.Deferred = Backbone.$.Deferred;
    Marionette.FEATURES = {};
    Marionette.isEnabled = function(name) {
      return !!Marionette.FEATURES[name];
    };
    Marionette.extend = Backbone.Model.extend;
    Marionette.isNodeAttached = function(el) {
      return Backbone.$.contains(document.documentElement, el);
    };
    Marionette.mergeOptions = function(options, keys) {
      if (!options) {
        return;
      }
      _.extend(this, _.pick(options, keys));
    };
    Marionette.getOption = function(target, optionName) {
      if (!target || !optionName) {
        return;
      }
      if (target.options && (target.options[optionName] !== undefined)) {
        return target.options[optionName];
      } else {
        return target[optionName];
      }
    };
    Marionette.proxyGetOption = function(optionName) {
      return Marionette.getOption(this, optionName);
    };
    Marionette._getValue = function(value, context, params) {
      if (_.isFunction(value)) {
        value = params ? value.apply(context, params) : value.call(context);
      }
      return value;
    };
    Marionette.normalizeMethods = function(hash) {
      return _.reduce(hash, function(normalizedHash, method, name) {
        if (!_.isFunction(method)) {
          method = this[method];
        }
        if (method) {
          normalizedHash[name] = method;
        }
        return normalizedHash;
      }, {}, this);
    };
    Marionette.normalizeUIString = function(uiString, ui) {
      return uiString.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function(r) {
        return ui[r.slice(4)];
      });
    };
    Marionette.normalizeUIKeys = function(hash, ui) {
      return _.reduce(hash, function(memo, val, key) {
        var normalizedKey = Marionette.normalizeUIString(key, ui);
        memo[normalizedKey] = val;
        return memo;
      }, {});
    };
    Marionette.normalizeUIValues = function(hash, ui, properties) {
      _.each(hash, function(val, key) {
        if (_.isString(val)) {
          hash[key] = Marionette.normalizeUIString(val, ui);
        } else if (_.isObject(val) && _.isArray(properties)) {
          _.extend(val, Marionette.normalizeUIValues(_.pick(val, properties), ui));
          _.each(properties, function(property) {
            var propertyVal = val[property];
            if (_.isString(propertyVal)) {
              val[property] = Marionette.normalizeUIString(propertyVal, ui);
            }
          });
        }
      });
      return hash;
    };
    Marionette.actAsCollection = function(object, listProperty) {
      var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'toArray', 'first', 'initial', 'rest', 'last', 'without', 'isEmpty', 'pluck'];
      _.each(methods, function(method) {
        object[method] = function() {
          var list = _.values(_.result(this, listProperty));
          var args = [list].concat(_.toArray(arguments));
          return _[method].apply(_, args);
        };
      });
    };
    var deprecate = Marionette.deprecate = function(message, test) {
      if (_.isObject(message)) {
        message = (message.prev + ' is going to be removed in the future. ' + 'Please use ' + message.next + ' instead.' + (message.url ? ' See: ' + message.url : ''));
      }
      if ((test === undefined || !test) && !deprecate._cache[message]) {
        deprecate._warn('Deprecation warning: ' + message);
        deprecate._cache[message] = true;
      }
    };
    deprecate._console = typeof console !== 'undefined' ? console : {};
    deprecate._warn = function() {
      var warn = deprecate._console.warn || deprecate._console.log || function() {};
      return warn.apply(deprecate._console, arguments);
    };
    deprecate._cache = {};
    Marionette._triggerMethod = (function() {
      var splitter = /(^|:)(\w)/gi;
      function getEventName(match, prefix, eventName) {
        return eventName.toUpperCase();
      }
      return function(context, event, args) {
        var noEventArg = arguments.length < 3;
        if (noEventArg) {
          args = event;
          event = args[0];
        }
        var methodName = 'on' + event.replace(splitter, getEventName);
        var method = context[methodName];
        var result;
        if (_.isFunction(method)) {
          result = method.apply(context, noEventArg ? _.rest(args) : args);
        }
        if (_.isFunction(context.trigger)) {
          if (noEventArg + args.length > 1) {
            context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
          } else {
            context.trigger(event);
          }
        }
        return result;
      };
    })();
    Marionette.triggerMethod = function(event) {
      return Marionette._triggerMethod(this, arguments);
    };
    Marionette.triggerMethodOn = function(context) {
      var fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : Marionette.triggerMethod;
      return fnc.apply(context, _.rest(arguments));
    };
    Marionette.MonitorDOMRefresh = function(view) {
      if (view._isDomRefreshMonitored) {
        return;
      }
      view._isDomRefreshMonitored = true;
      function handleShow() {
        view._isShown = true;
        triggerDOMRefresh();
      }
      function handleRender() {
        view._isRendered = true;
        triggerDOMRefresh();
      }
      function triggerDOMRefresh() {
        if (view._isShown && view._isRendered && Marionette.isNodeAttached(view.el)) {
          Marionette.triggerMethodOn(view, 'dom:refresh', view);
        }
      }
      view.on({
        show: handleShow,
        render: handleRender
      });
    };
    (function(Marionette) {
      'use strict';
      function bindFromStrings(target, entity, evt, methods) {
        var methodNames = methods.split(/\s+/);
        _.each(methodNames, function(methodName) {
          var method = target[methodName];
          if (!method) {
            throw new Marionette.Error('Method "' + methodName + '" was configured as an event handler, but does not exist.');
          }
          target.listenTo(entity, evt, method);
        });
      }
      function bindToFunction(target, entity, evt, method) {
        target.listenTo(entity, evt, method);
      }
      function unbindFromStrings(target, entity, evt, methods) {
        var methodNames = methods.split(/\s+/);
        _.each(methodNames, function(methodName) {
          var method = target[methodName];
          target.stopListening(entity, evt, method);
        });
      }
      function unbindToFunction(target, entity, evt, method) {
        target.stopListening(entity, evt, method);
      }
      function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
        if (!entity || !bindings) {
          return;
        }
        if (!_.isObject(bindings)) {
          throw new Marionette.Error({
            message: 'Bindings must be an object or function.',
            url: 'marionette.functions.html#marionettebindentityevents'
          });
        }
        bindings = Marionette._getValue(bindings, target);
        _.each(bindings, function(methods, evt) {
          if (_.isFunction(methods)) {
            functionCallback(target, entity, evt, methods);
          } else {
            stringCallback(target, entity, evt, methods);
          }
        });
      }
      Marionette.bindEntityEvents = function(target, entity, bindings) {
        iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
      };
      Marionette.unbindEntityEvents = function(target, entity, bindings) {
        iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
      };
      Marionette.proxyBindEntityEvents = function(entity, bindings) {
        return Marionette.bindEntityEvents(this, entity, bindings);
      };
      Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
        return Marionette.unbindEntityEvents(this, entity, bindings);
      };
    })(Marionette);
    var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];
    Marionette.Error = Marionette.extend.call(Error, {
      urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/',
      constructor: function(message, options) {
        if (_.isObject(message)) {
          options = message;
          message = options.message;
        } else if (!options) {
          options = {};
        }
        var error = Error.call(this, message);
        _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));
        this.captureStackTrace();
        if (options.url) {
          this.url = this.urlRoot + options.url;
        }
      },
      captureStackTrace: function() {
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, Marionette.Error);
        }
      },
      toString: function() {
        return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
      }
    });
    Marionette.Error.extend = Marionette.extend;
    Marionette.Callbacks = function() {
      this._deferred = Marionette.Deferred();
      this._callbacks = [];
    };
    _.extend(Marionette.Callbacks.prototype, {
      add: function(callback, contextOverride) {
        var promise = _.result(this._deferred, 'promise');
        this._callbacks.push({
          cb: callback,
          ctx: contextOverride
        });
        promise.then(function(args) {
          if (contextOverride) {
            args.context = contextOverride;
          }
          callback.call(args.context, args.options);
        });
      },
      run: function(options, context) {
        this._deferred.resolve({
          options: options,
          context: context
        });
      },
      reset: function() {
        var callbacks = this._callbacks;
        this._deferred = Marionette.Deferred();
        this._callbacks = [];
        _.each(callbacks, function(cb) {
          this.add(cb.cb, cb.ctx);
        }, this);
      }
    });
    Marionette.Controller = function(options) {
      this.options = options || {};
      if (_.isFunction(this.initialize)) {
        this.initialize(this.options);
      }
    };
    Marionette.Controller.extend = Marionette.extend;
    _.extend(Marionette.Controller.prototype, Backbone.Events, {
      destroy: function() {
        Marionette._triggerMethod(this, 'before:destroy', arguments);
        Marionette._triggerMethod(this, 'destroy', arguments);
        this.stopListening();
        this.off();
        return this;
      },
      triggerMethod: Marionette.triggerMethod,
      mergeOptions: Marionette.mergeOptions,
      getOption: Marionette.proxyGetOption
    });
    Marionette.Object = function(options) {
      this.options = _.extend({}, _.result(this, 'options'), options);
      this.initialize.apply(this, arguments);
    };
    Marionette.Object.extend = Marionette.extend;
    _.extend(Marionette.Object.prototype, Backbone.Events, {
      initialize: function() {},
      destroy: function(options) {
        options = options || {};
        this.triggerMethod('before:destroy', options);
        this.triggerMethod('destroy', options);
        this.stopListening();
        return this;
      },
      triggerMethod: Marionette.triggerMethod,
      mergeOptions: Marionette.mergeOptions,
      getOption: Marionette.proxyGetOption,
      bindEntityEvents: Marionette.proxyBindEntityEvents,
      unbindEntityEvents: Marionette.proxyUnbindEntityEvents
    });
    Marionette.Region = Marionette.Object.extend({
      constructor: function(options) {
        this.options = options || {};
        this.el = this.getOption('el');
        this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;
        if (!this.el) {
          throw new Marionette.Error({
            name: 'NoElError',
            message: 'An "el" must be specified for a region.'
          });
        }
        this.$el = this.getEl(this.el);
        Marionette.Object.call(this, options);
      },
      show: function(view, options) {
        if (!this._ensureElement()) {
          return;
        }
        this._ensureViewIsIntact(view);
        Marionette.MonitorDOMRefresh(view);
        var showOptions = options || {};
        var isDifferentView = view !== this.currentView;
        var preventDestroy = !!showOptions.preventDestroy;
        var forceShow = !!showOptions.forceShow;
        var isChangingView = !!this.currentView;
        var _shouldDestroyView = isDifferentView && !preventDestroy;
        var _shouldShowView = isDifferentView || forceShow;
        if (isChangingView) {
          this.triggerMethod('before:swapOut', this.currentView, this, options);
        }
        if (this.currentView && isDifferentView) {
          delete this.currentView._parent;
        }
        if (_shouldDestroyView) {
          this.empty();
        } else if (isChangingView && _shouldShowView) {
          this.currentView.off('destroy', this.empty, this);
        }
        if (_shouldShowView) {
          view.once('destroy', this.empty, this);
          view._parent = this;
          this._renderView(view);
          if (isChangingView) {
            this.triggerMethod('before:swap', view, this, options);
          }
          this.triggerMethod('before:show', view, this, options);
          Marionette.triggerMethodOn(view, 'before:show', view, this, options);
          if (isChangingView) {
            this.triggerMethod('swapOut', this.currentView, this, options);
          }
          var attachedRegion = Marionette.isNodeAttached(this.el);
          var displayedViews = [];
          var attachOptions = _.extend({
            triggerBeforeAttach: this.triggerBeforeAttach,
            triggerAttach: this.triggerAttach
          }, showOptions);
          if (attachedRegion && attachOptions.triggerBeforeAttach) {
            displayedViews = this._displayedViews(view);
            this._triggerAttach(displayedViews, 'before:');
          }
          this.attachHtml(view);
          this.currentView = view;
          if (attachedRegion && attachOptions.triggerAttach) {
            displayedViews = this._displayedViews(view);
            this._triggerAttach(displayedViews);
          }
          if (isChangingView) {
            this.triggerMethod('swap', view, this, options);
          }
          this.triggerMethod('show', view, this, options);
          Marionette.triggerMethodOn(view, 'show', view, this, options);
          return this;
        }
        return this;
      },
      triggerBeforeAttach: true,
      triggerAttach: true,
      _triggerAttach: function(views, prefix) {
        var eventName = (prefix || '') + 'attach';
        _.each(views, function(view) {
          Marionette.triggerMethodOn(view, eventName, view, this);
        }, this);
      },
      _displayedViews: function(view) {
        return _.union([view], _.result(view, '_getNestedViews') || []);
      },
      _renderView: function(view) {
        if (!view.supportsRenderLifecycle) {
          Marionette.triggerMethodOn(view, 'before:render', view);
        }
        view.render();
        if (!view.supportsRenderLifecycle) {
          Marionette.triggerMethodOn(view, 'render', view);
        }
      },
      _ensureElement: function() {
        if (!_.isObject(this.el)) {
          this.$el = this.getEl(this.el);
          this.el = this.$el[0];
        }
        if (!this.$el || this.$el.length === 0) {
          if (this.getOption('allowMissingEl')) {
            return false;
          } else {
            throw new Marionette.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
          }
        }
        return true;
      },
      _ensureViewIsIntact: function(view) {
        if (!view) {
          throw new Marionette.Error({
            name: 'ViewNotValid',
            message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
          });
        }
        if (view.isDestroyed) {
          throw new Marionette.Error({
            name: 'ViewDestroyedError',
            message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
          });
        }
      },
      getEl: function(el) {
        return Backbone.$(el, Marionette._getValue(this.options.parentEl, this));
      },
      attachHtml: function(view) {
        this.$el.contents().detach();
        this.el.appendChild(view.el);
      },
      empty: function(options) {
        var view = this.currentView;
        var emptyOptions = options || {};
        var preventDestroy = !!emptyOptions.preventDestroy;
        if (!view) {
          return this;
        }
        view.off('destroy', this.empty, this);
        this.triggerMethod('before:empty', view);
        if (!preventDestroy) {
          this._destroyView();
        }
        this.triggerMethod('empty', view);
        delete this.currentView;
        if (preventDestroy) {
          this.$el.contents().detach();
        }
        return this;
      },
      _destroyView: function() {
        var view = this.currentView;
        if (view.isDestroyed) {
          return;
        }
        if (!view.supportsDestroyLifecycle) {
          Marionette.triggerMethodOn(view, 'before:destroy', view);
        }
        if (view.destroy) {
          view.destroy();
        } else {
          view.remove();
          view.isDestroyed = true;
        }
        if (!view.supportsDestroyLifecycle) {
          Marionette.triggerMethodOn(view, 'destroy', view);
        }
      },
      attachView: function(view) {
        if (this.currentView) {
          delete this.currentView._parent;
        }
        view._parent = this;
        this.currentView = view;
        return this;
      },
      hasView: function() {
        return !!this.currentView;
      },
      reset: function() {
        this.empty();
        if (this.$el) {
          this.el = this.$el.selector;
        }
        delete this.$el;
        return this;
      }
    }, {
      buildRegion: function(regionConfig, DefaultRegionClass) {
        if (_.isString(regionConfig)) {
          return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
        }
        if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
          return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
        }
        if (_.isFunction(regionConfig)) {
          return this._buildRegionFromRegionClass(regionConfig);
        }
        throw new Marionette.Error({
          message: 'Improper region configuration type.',
          url: 'marionette.region.html#region-configuration-types'
        });
      },
      _buildRegionFromSelector: function(selector, DefaultRegionClass) {
        return new DefaultRegionClass({el: selector});
      },
      _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
        var RegionClass = regionConfig.regionClass || DefaultRegionClass;
        var options = _.omit(regionConfig, 'selector', 'regionClass');
        if (regionConfig.selector && !options.el) {
          options.el = regionConfig.selector;
        }
        return new RegionClass(options);
      },
      _buildRegionFromRegionClass: function(RegionClass) {
        return new RegionClass();
      }
    });
    Marionette.RegionManager = Marionette.Controller.extend({
      constructor: function(options) {
        this._regions = {};
        this.length = 0;
        Marionette.Controller.call(this, options);
        this.addRegions(this.getOption('regions'));
      },
      addRegions: function(regionDefinitions, defaults) {
        regionDefinitions = Marionette._getValue(regionDefinitions, this, arguments);
        return _.reduce(regionDefinitions, function(regions, definition, name) {
          if (_.isString(definition)) {
            definition = {selector: definition};
          }
          if (definition.selector) {
            definition = _.defaults({}, definition, defaults);
          }
          regions[name] = this.addRegion(name, definition);
          return regions;
        }, {}, this);
      },
      addRegion: function(name, definition) {
        var region;
        if (definition instanceof Marionette.Region) {
          region = definition;
        } else {
          region = Marionette.Region.buildRegion(definition, Marionette.Region);
        }
        this.triggerMethod('before:add:region', name, region);
        region._parent = this;
        this._store(name, region);
        this.triggerMethod('add:region', name, region);
        return region;
      },
      get: function(name) {
        return this._regions[name];
      },
      getRegions: function() {
        return _.clone(this._regions);
      },
      removeRegion: function(name) {
        var region = this._regions[name];
        this._remove(name, region);
        return region;
      },
      removeRegions: function() {
        var regions = this.getRegions();
        _.each(this._regions, function(region, name) {
          this._remove(name, region);
        }, this);
        return regions;
      },
      emptyRegions: function() {
        var regions = this.getRegions();
        _.invoke(regions, 'empty');
        return regions;
      },
      destroy: function() {
        this.removeRegions();
        return Marionette.Controller.prototype.destroy.apply(this, arguments);
      },
      _store: function(name, region) {
        if (!this._regions[name]) {
          this.length++;
        }
        this._regions[name] = region;
      },
      _remove: function(name, region) {
        this.triggerMethod('before:remove:region', name, region);
        region.empty();
        region.stopListening();
        delete region._parent;
        delete this._regions[name];
        this.length--;
        this.triggerMethod('remove:region', name, region);
      }
    });
    Marionette.actAsCollection(Marionette.RegionManager.prototype, '_regions');
    Marionette.TemplateCache = function(templateId) {
      this.templateId = templateId;
    };
    _.extend(Marionette.TemplateCache, {
      templateCaches: {},
      get: function(templateId, options) {
        var cachedTemplate = this.templateCaches[templateId];
        if (!cachedTemplate) {
          cachedTemplate = new Marionette.TemplateCache(templateId);
          this.templateCaches[templateId] = cachedTemplate;
        }
        return cachedTemplate.load(options);
      },
      clear: function() {
        var i;
        var args = _.toArray(arguments);
        var length = args.length;
        if (length > 0) {
          for (i = 0; i < length; i++) {
            delete this.templateCaches[args[i]];
          }
        } else {
          this.templateCaches = {};
        }
      }
    });
    _.extend(Marionette.TemplateCache.prototype, {
      load: function(options) {
        if (this.compiledTemplate) {
          return this.compiledTemplate;
        }
        var template = this.loadTemplate(this.templateId, options);
        this.compiledTemplate = this.compileTemplate(template, options);
        return this.compiledTemplate;
      },
      loadTemplate: function(templateId, options) {
        var $template = Backbone.$(templateId);
        if (!$template.length) {
          throw new Marionette.Error({
            name: 'NoTemplateError',
            message: 'Could not find template: "' + templateId + '"'
          });
        }
        return $template.html();
      },
      compileTemplate: function(rawTemplate, options) {
        return _.template(rawTemplate, options);
      }
    });
    Marionette.Renderer = {render: function(template, data) {
        if (!template) {
          throw new Marionette.Error({
            name: 'TemplateNotFoundError',
            message: 'Cannot render the template since its false, null or undefined.'
          });
        }
        var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template);
        return templateFunc(data);
      }};
    Marionette.View = Backbone.View.extend({
      isDestroyed: false,
      supportsRenderLifecycle: true,
      supportsDestroyLifecycle: true,
      constructor: function(options) {
        this.render = _.bind(this.render, this);
        options = Marionette._getValue(options, this);
        this.options = _.extend({}, _.result(this, 'options'), options);
        this._behaviors = Marionette.Behaviors(this);
        Backbone.View.call(this, this.options);
        Marionette.MonitorDOMRefresh(this);
      },
      getTemplate: function() {
        return this.getOption('template');
      },
      serializeModel: function(model) {
        return model.toJSON.apply(model, _.rest(arguments));
      },
      mixinTemplateHelpers: function(target) {
        target = target || {};
        var templateHelpers = this.getOption('templateHelpers');
        templateHelpers = Marionette._getValue(templateHelpers, this);
        return _.extend(target, templateHelpers);
      },
      normalizeUIKeys: function(hash) {
        var uiBindings = _.result(this, '_uiBindings');
        return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
      },
      normalizeUIValues: function(hash, properties) {
        var ui = _.result(this, 'ui');
        var uiBindings = _.result(this, '_uiBindings');
        return Marionette.normalizeUIValues(hash, uiBindings || ui, properties);
      },
      configureTriggers: function() {
        if (!this.triggers) {
          return;
        }
        var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));
        return _.reduce(triggers, function(events, value, key) {
          events[key] = this._buildViewTrigger(value);
          return events;
        }, {}, this);
      },
      delegateEvents: function(events) {
        this._delegateDOMEvents(events);
        this.bindEntityEvents(this.model, this.getOption('modelEvents'));
        this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
        _.each(this._behaviors, function(behavior) {
          behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
          behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
        }, this);
        return this;
      },
      _delegateDOMEvents: function(eventsArg) {
        var events = Marionette._getValue(eventsArg || this.events, this);
        events = this.normalizeUIKeys(events);
        if (_.isUndefined(eventsArg)) {
          this.events = events;
        }
        var combinedEvents = {};
        var behaviorEvents = _.result(this, 'behaviorEvents') || {};
        var triggers = this.configureTriggers();
        var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};
        _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);
        Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
      },
      undelegateEvents: function() {
        Backbone.View.prototype.undelegateEvents.apply(this, arguments);
        this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
        this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
        _.each(this._behaviors, function(behavior) {
          behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
          behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
        }, this);
        return this;
      },
      _ensureViewIsIntact: function() {
        if (this.isDestroyed) {
          throw new Marionette.Error({
            name: 'ViewDestroyedError',
            message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
          });
        }
      },
      destroy: function() {
        if (this.isDestroyed) {
          return this;
        }
        var args = _.toArray(arguments);
        this.triggerMethod.apply(this, ['before:destroy'].concat(args));
        this.isDestroyed = true;
        this.triggerMethod.apply(this, ['destroy'].concat(args));
        this.unbindUIElements();
        this.isRendered = false;
        this.remove();
        _.invoke(this._behaviors, 'destroy', args);
        return this;
      },
      bindUIElements: function() {
        this._bindUIElements();
        _.invoke(this._behaviors, this._bindUIElements);
      },
      _bindUIElements: function() {
        if (!this.ui) {
          return;
        }
        if (!this._uiBindings) {
          this._uiBindings = this.ui;
        }
        var bindings = _.result(this, '_uiBindings');
        this.ui = {};
        _.each(bindings, function(selector, key) {
          this.ui[key] = this.$(selector);
        }, this);
      },
      unbindUIElements: function() {
        this._unbindUIElements();
        _.invoke(this._behaviors, this._unbindUIElements);
      },
      _unbindUIElements: function() {
        if (!this.ui || !this._uiBindings) {
          return;
        }
        _.each(this.ui, function($el, name) {
          delete this.ui[name];
        }, this);
        this.ui = this._uiBindings;
        delete this._uiBindings;
      },
      _buildViewTrigger: function(triggerDef) {
        var options = _.defaults({}, triggerDef, {
          preventDefault: true,
          stopPropagation: true
        });
        var eventName = _.isObject(triggerDef) ? options.event : triggerDef;
        return function(e) {
          if (e) {
            if (e.preventDefault && options.preventDefault) {
              e.preventDefault();
            }
            if (e.stopPropagation && options.stopPropagation) {
              e.stopPropagation();
            }
          }
          var args = {
            view: this,
            model: this.model,
            collection: this.collection
          };
          this.triggerMethod(eventName, args);
        };
      },
      setElement: function() {
        var ret = Backbone.View.prototype.setElement.apply(this, arguments);
        _.invoke(this._behaviors, 'proxyViewProperties', this);
        return ret;
      },
      triggerMethod: function() {
        var ret = Marionette._triggerMethod(this, arguments);
        this._triggerEventOnBehaviors(arguments);
        this._triggerEventOnParentLayout(arguments[0], _.rest(arguments));
        return ret;
      },
      _triggerEventOnBehaviors: function(args) {
        var triggerMethod = Marionette._triggerMethod;
        var behaviors = this._behaviors;
        for (var i = 0,
            length = behaviors && behaviors.length; i < length; i++) {
          triggerMethod(behaviors[i], args);
        }
      },
      _triggerEventOnParentLayout: function(eventName, args) {
        var layoutView = this._parentLayoutView();
        if (!layoutView) {
          return;
        }
        var eventPrefix = Marionette.getOption(layoutView, 'childViewEventPrefix');
        var prefixedEventName = eventPrefix + ':' + eventName;
        var callArgs = [this].concat(args);
        Marionette._triggerMethod(layoutView, prefixedEventName, callArgs);
        var childEvents = Marionette.getOption(layoutView, 'childEvents');
        childEvents = Marionette._getValue(childEvents, layoutView);
        var normalizedChildEvents = layoutView.normalizeMethods(childEvents);
        if (normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
          normalizedChildEvents[eventName].apply(layoutView, callArgs);
        }
      },
      _getImmediateChildren: function() {
        return [];
      },
      _getNestedViews: function() {
        var children = this._getImmediateChildren();
        if (!children.length) {
          return children;
        }
        return _.reduce(children, function(memo, view) {
          if (!view._getNestedViews) {
            return memo;
          }
          return memo.concat(view._getNestedViews());
        }, children);
      },
      _parentLayoutView: function() {
        var parent = this._parent;
        while (parent) {
          if (parent instanceof Marionette.LayoutView) {
            return parent;
          }
          parent = parent._parent;
        }
      },
      normalizeMethods: Marionette.normalizeMethods,
      mergeOptions: Marionette.mergeOptions,
      getOption: Marionette.proxyGetOption,
      bindEntityEvents: Marionette.proxyBindEntityEvents,
      unbindEntityEvents: Marionette.proxyUnbindEntityEvents
    });
    Marionette.ItemView = Marionette.View.extend({
      constructor: function() {
        Marionette.View.apply(this, arguments);
      },
      serializeData: function() {
        if (!this.model && !this.collection) {
          return {};
        }
        var args = [this.model || this.collection];
        if (arguments.length) {
          args.push.apply(args, arguments);
        }
        if (this.model) {
          return this.serializeModel.apply(this, args);
        } else {
          return {items: this.serializeCollection.apply(this, args)};
        }
      },
      serializeCollection: function(collection) {
        return collection.toJSON.apply(collection, _.rest(arguments));
      },
      render: function() {
        this._ensureViewIsIntact();
        this.triggerMethod('before:render', this);
        this._renderTemplate();
        this.isRendered = true;
        this.bindUIElements();
        this.triggerMethod('render', this);
        return this;
      },
      _renderTemplate: function() {
        var template = this.getTemplate();
        if (template === false) {
          return;
        }
        if (!template) {
          throw new Marionette.Error({
            name: 'UndefinedTemplateError',
            message: 'Cannot render the template since it is null or undefined.'
          });
        }
        var data = this.mixinTemplateHelpers(this.serializeData());
        var html = Marionette.Renderer.render(template, data, this);
        this.attachElContent(html);
        return this;
      },
      attachElContent: function(html) {
        this.$el.html(html);
        return this;
      }
    });
    Marionette.CollectionView = Marionette.View.extend({
      childViewEventPrefix: 'childview',
      sort: true,
      constructor: function(options) {
        this.once('render', this._initialEvents);
        this._initChildViewStorage();
        Marionette.View.apply(this, arguments);
        this.on({
          'before:show': this._onBeforeShowCalled,
          'show': this._onShowCalled,
          'before:attach': this._onBeforeAttachCalled,
          'attach': this._onAttachCalled
        });
        this.initRenderBuffer();
      },
      initRenderBuffer: function() {
        this._bufferedChildren = [];
      },
      startBuffering: function() {
        this.initRenderBuffer();
        this.isBuffering = true;
      },
      endBuffering: function() {
        var canTriggerAttach = this._isShown && Marionette.isNodeAttached(this.el);
        var nestedViews;
        this.isBuffering = false;
        if (this._isShown) {
          this._triggerMethodMany(this._bufferedChildren, this, 'before:show');
        }
        if (canTriggerAttach && this._triggerBeforeAttach) {
          nestedViews = this._getNestedViews();
          this._triggerMethodMany(nestedViews, this, 'before:attach');
        }
        this.attachBuffer(this, this._createBuffer());
        if (canTriggerAttach && this._triggerAttach) {
          nestedViews = this._getNestedViews();
          this._triggerMethodMany(nestedViews, this, 'attach');
        }
        if (this._isShown) {
          this._triggerMethodMany(this._bufferedChildren, this, 'show');
        }
        this.initRenderBuffer();
      },
      _triggerMethodMany: function(targets, source, eventName) {
        var args = _.drop(arguments, 3);
        _.each(targets, function(target) {
          Marionette.triggerMethodOn.apply(target, [target, eventName, target, source].concat(args));
        });
      },
      _initialEvents: function() {
        if (this.collection) {
          this.listenTo(this.collection, 'add', this._onCollectionAdd);
          this.listenTo(this.collection, 'remove', this._onCollectionRemove);
          this.listenTo(this.collection, 'reset', this.render);
          if (this.getOption('sort')) {
            this.listenTo(this.collection, 'sort', this._sortViews);
          }
        }
      },
      _onCollectionAdd: function(child, collection, opts) {
        var index = opts.at !== undefined && (opts.index || collection.indexOf(child));
        if (this.getOption('filter') || index === false) {
          index = _.indexOf(this._filteredSortedModels(index), child);
        }
        if (this._shouldAddChild(child, index)) {
          this.destroyEmptyView();
          var ChildView = this.getChildView(child);
          this.addChild(child, ChildView, index);
        }
      },
      _onCollectionRemove: function(model) {
        var view = this.children.findByModel(model);
        this.removeChildView(view);
        this.checkEmpty();
      },
      _onBeforeShowCalled: function() {
        this._triggerBeforeAttach = this._triggerAttach = false;
        this.children.each(function(childView) {
          Marionette.triggerMethodOn(childView, 'before:show', childView);
        });
      },
      _onShowCalled: function() {
        this.children.each(function(childView) {
          Marionette.triggerMethodOn(childView, 'show', childView);
        });
      },
      _onBeforeAttachCalled: function() {
        this._triggerBeforeAttach = true;
      },
      _onAttachCalled: function() {
        this._triggerAttach = true;
      },
      render: function() {
        this._ensureViewIsIntact();
        this.triggerMethod('before:render', this);
        this._renderChildren();
        this.isRendered = true;
        this.triggerMethod('render', this);
        return this;
      },
      reorder: function() {
        var children = this.children;
        var models = this._filteredSortedModels();
        var anyModelsAdded = _.some(models, function(model) {
          return !children.findByModel(model);
        });
        if (anyModelsAdded) {
          this.render();
        } else {
          var elsToReorder = _.map(models, function(model, index) {
            var view = children.findByModel(model);
            view._index = index;
            return view.el;
          });
          var filteredOutViews = children.filter(function(view) {
            return !_.contains(elsToReorder, view.el);
          });
          this.triggerMethod('before:reorder');
          this._appendReorderedChildren(elsToReorder);
          _.each(filteredOutViews, this.removeChildView, this);
          this.checkEmpty();
          this.triggerMethod('reorder');
        }
      },
      resortView: function() {
        if (Marionette.getOption(this, 'reorderOnSort')) {
          this.reorder();
        } else {
          this.render();
        }
      },
      _sortViews: function() {
        var models = this._filteredSortedModels();
        var orderChanged = _.find(models, function(item, index) {
          var view = this.children.findByModel(item);
          return !view || view._index !== index;
        }, this);
        if (orderChanged) {
          this.resortView();
        }
      },
      _emptyViewIndex: -1,
      _appendReorderedChildren: function(children) {
        this.$el.append(children);
      },
      _renderChildren: function() {
        this.destroyEmptyView();
        this.destroyChildren({checkEmpty: false});
        if (this.isEmpty(this.collection)) {
          this.showEmptyView();
        } else {
          this.triggerMethod('before:render:collection', this);
          this.startBuffering();
          this.showCollection();
          this.endBuffering();
          this.triggerMethod('render:collection', this);
          if (this.children.isEmpty() && this.getOption('filter')) {
            this.showEmptyView();
          }
        }
      },
      showCollection: function() {
        var ChildView;
        var models = this._filteredSortedModels();
        _.each(models, function(child, index) {
          ChildView = this.getChildView(child);
          this.addChild(child, ChildView, index);
        }, this);
      },
      _filteredSortedModels: function(addedAt) {
        var viewComparator = this.getViewComparator();
        var models = this.collection.models;
        addedAt = Math.min(Math.max(addedAt, 0), models.length - 1);
        if (viewComparator) {
          var addedModel;
          if (addedAt) {
            addedModel = models[addedAt];
            models = models.slice(0, addedAt).concat(models.slice(addedAt + 1));
          }
          models = this._sortModelsBy(models, viewComparator);
          if (addedModel) {
            models.splice(addedAt, 0, addedModel);
          }
        }
        if (this.getOption('filter')) {
          models = _.filter(models, function(model, index) {
            return this._shouldAddChild(model, index);
          }, this);
        }
        return models;
      },
      _sortModelsBy: function(models, comparator) {
        if (typeof comparator === 'string') {
          return _.sortBy(models, function(model) {
            return model.get(comparator);
          }, this);
        } else if (comparator.length === 1) {
          return _.sortBy(models, comparator, this);
        } else {
          return models.sort(_.bind(comparator, this));
        }
      },
      showEmptyView: function() {
        var EmptyView = this.getEmptyView();
        if (EmptyView && !this._showingEmptyView) {
          this.triggerMethod('before:render:empty');
          this._showingEmptyView = true;
          var model = new Backbone.Model();
          this.addEmptyView(model, EmptyView);
          this.triggerMethod('render:empty');
        }
      },
      destroyEmptyView: function() {
        if (this._showingEmptyView) {
          this.triggerMethod('before:remove:empty');
          this.destroyChildren();
          delete this._showingEmptyView;
          this.triggerMethod('remove:empty');
        }
      },
      getEmptyView: function() {
        return this.getOption('emptyView');
      },
      addEmptyView: function(child, EmptyView) {
        var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
        var nestedViews;
        var emptyViewOptions = this.getOption('emptyViewOptions') || this.getOption('childViewOptions');
        if (_.isFunction(emptyViewOptions)) {
          emptyViewOptions = emptyViewOptions.call(this, child, this._emptyViewIndex);
        }
        var view = this.buildChildView(child, EmptyView, emptyViewOptions);
        view._parent = this;
        this.proxyChildEvents(view);
        view.once('render', function() {
          if (this._isShown) {
            Marionette.triggerMethodOn(view, 'before:show', view);
          }
          if (canTriggerAttach && this._triggerBeforeAttach) {
            nestedViews = this._getViewAndNested(view);
            this._triggerMethodMany(nestedViews, this, 'before:attach');
          }
        }, this);
        this.children.add(view);
        this.renderChildView(view, this._emptyViewIndex);
        if (canTriggerAttach && this._triggerAttach) {
          nestedViews = this._getViewAndNested(view);
          this._triggerMethodMany(nestedViews, this, 'attach');
        }
        if (this._isShown) {
          Marionette.triggerMethodOn(view, 'show', view);
        }
      },
      getChildView: function(child) {
        var childView = this.getOption('childView');
        if (!childView) {
          throw new Marionette.Error({
            name: 'NoChildViewError',
            message: 'A "childView" must be specified'
          });
        }
        return childView;
      },
      addChild: function(child, ChildView, index) {
        var childViewOptions = this.getOption('childViewOptions');
        childViewOptions = Marionette._getValue(childViewOptions, this, [child, index]);
        var view = this.buildChildView(child, ChildView, childViewOptions);
        this._updateIndices(view, true, index);
        this.triggerMethod('before:add:child', view);
        this._addChildView(view, index);
        this.triggerMethod('add:child', view);
        view._parent = this;
        return view;
      },
      _updateIndices: function(view, increment, index) {
        if (!this.getOption('sort')) {
          return;
        }
        if (increment) {
          view._index = index;
        }
        this.children.each(function(laterView) {
          if (laterView._index >= view._index) {
            laterView._index += increment ? 1 : -1;
          }
        });
      },
      _addChildView: function(view, index) {
        var canTriggerAttach = this._isShown && !this.isBuffering && Marionette.isNodeAttached(this.el);
        var nestedViews;
        this.proxyChildEvents(view);
        view.once('render', function() {
          if (this._isShown && !this.isBuffering) {
            Marionette.triggerMethodOn(view, 'before:show', view);
          }
          if (canTriggerAttach && this._triggerBeforeAttach) {
            nestedViews = this._getViewAndNested(view);
            this._triggerMethodMany(nestedViews, this, 'before:attach');
          }
        }, this);
        this.children.add(view);
        this.renderChildView(view, index);
        if (canTriggerAttach && this._triggerAttach) {
          nestedViews = this._getViewAndNested(view);
          this._triggerMethodMany(nestedViews, this, 'attach');
        }
        if (this._isShown && !this.isBuffering) {
          Marionette.triggerMethodOn(view, 'show', view);
        }
      },
      renderChildView: function(view, index) {
        if (!view.supportsRenderLifecycle) {
          Marionette.triggerMethodOn(view, 'before:render', view);
        }
        view.render();
        if (!view.supportsRenderLifecycle) {
          Marionette.triggerMethodOn(view, 'render', view);
        }
        this.attachHtml(this, view, index);
        return view;
      },
      buildChildView: function(child, ChildViewClass, childViewOptions) {
        var options = _.extend({model: child}, childViewOptions);
        var childView = new ChildViewClass(options);
        Marionette.MonitorDOMRefresh(childView);
        return childView;
      },
      removeChildView: function(view) {
        if (!view) {
          return view;
        }
        this.triggerMethod('before:remove:child', view);
        if (!view.supportsDestroyLifecycle) {
          Marionette.triggerMethodOn(view, 'before:destroy', view);
        }
        if (view.destroy) {
          view.destroy();
        } else {
          view.remove();
        }
        if (!view.supportsDestroyLifecycle) {
          Marionette.triggerMethodOn(view, 'destroy', view);
        }
        delete view._parent;
        this.stopListening(view);
        this.children.remove(view);
        this.triggerMethod('remove:child', view);
        this._updateIndices(view, false);
        return view;
      },
      isEmpty: function() {
        return !this.collection || this.collection.length === 0;
      },
      checkEmpty: function() {
        if (this.isEmpty(this.collection)) {
          this.showEmptyView();
        }
      },
      attachBuffer: function(collectionView, buffer) {
        collectionView.$el.append(buffer);
      },
      _createBuffer: function() {
        var elBuffer = document.createDocumentFragment();
        _.each(this._bufferedChildren, function(b) {
          elBuffer.appendChild(b.el);
        });
        return elBuffer;
      },
      attachHtml: function(collectionView, childView, index) {
        if (collectionView.isBuffering) {
          collectionView._bufferedChildren.splice(index, 0, childView);
        } else {
          if (!collectionView._insertBefore(childView, index)) {
            collectionView._insertAfter(childView);
          }
        }
      },
      _insertBefore: function(childView, index) {
        var currentView;
        var findPosition = this.getOption('sort') && (index < this.children.length - 1);
        if (findPosition) {
          currentView = this.children.find(function(view) {
            return view._index === index + 1;
          });
        }
        if (currentView) {
          currentView.$el.before(childView.el);
          return true;
        }
        return false;
      },
      _insertAfter: function(childView) {
        this.$el.append(childView.el);
      },
      _initChildViewStorage: function() {
        this.children = new Backbone.ChildViewContainer();
      },
      destroy: function() {
        if (this.isDestroyed) {
          return this;
        }
        this.triggerMethod('before:destroy:collection');
        this.destroyChildren({checkEmpty: false});
        this.triggerMethod('destroy:collection');
        return Marionette.View.prototype.destroy.apply(this, arguments);
      },
      destroyChildren: function(options) {
        var destroyOptions = options || {};
        var shouldCheckEmpty = true;
        var childViews = this.children.map(_.identity);
        if (!_.isUndefined(destroyOptions.checkEmpty)) {
          shouldCheckEmpty = destroyOptions.checkEmpty;
        }
        this.children.each(this.removeChildView, this);
        if (shouldCheckEmpty) {
          this.checkEmpty();
        }
        return childViews;
      },
      _shouldAddChild: function(child, index) {
        var filter = this.getOption('filter');
        return !_.isFunction(filter) || filter.call(this, child, index, this.collection);
      },
      proxyChildEvents: function(view) {
        var prefix = this.getOption('childViewEventPrefix');
        this.listenTo(view, 'all', function() {
          var args = _.toArray(arguments);
          var rootEvent = args[0];
          var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));
          args[0] = prefix + ':' + rootEvent;
          args.splice(1, 0, view);
          if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
            childEvents[rootEvent].apply(this, args.slice(1));
          }
          this.triggerMethod.apply(this, args);
        });
      },
      _getImmediateChildren: function() {
        return _.values(this.children._views);
      },
      _getViewAndNested: function(view) {
        return [view].concat(_.result(view, '_getNestedViews') || []);
      },
      getViewComparator: function() {
        return this.getOption('viewComparator');
      }
    });
    Marionette.CompositeView = Marionette.CollectionView.extend({
      constructor: function() {
        Marionette.CollectionView.apply(this, arguments);
      },
      _initialEvents: function() {
        if (this.collection) {
          this.listenTo(this.collection, 'add', this._onCollectionAdd);
          this.listenTo(this.collection, 'remove', this._onCollectionRemove);
          this.listenTo(this.collection, 'reset', this._renderChildren);
          if (this.getOption('sort')) {
            this.listenTo(this.collection, 'sort', this._sortViews);
          }
        }
      },
      getChildView: function(child) {
        var childView = this.getOption('childView') || this.constructor;
        return childView;
      },
      serializeData: function() {
        var data = {};
        if (this.model) {
          data = _.partial(this.serializeModel, this.model).apply(this, arguments);
        }
        return data;
      },
      render: function() {
        this._ensureViewIsIntact();
        this._isRendering = true;
        this.resetChildViewContainer();
        this.triggerMethod('before:render', this);
        this._renderTemplate();
        this._renderChildren();
        this._isRendering = false;
        this.isRendered = true;
        this.triggerMethod('render', this);
        return this;
      },
      _renderChildren: function() {
        if (this.isRendered || this._isRendering) {
          Marionette.CollectionView.prototype._renderChildren.call(this);
        }
      },
      _renderTemplate: function() {
        var data = {};
        data = this.serializeData();
        data = this.mixinTemplateHelpers(data);
        this.triggerMethod('before:render:template');
        var template = this.getTemplate();
        var html = Marionette.Renderer.render(template, data, this);
        this.attachElContent(html);
        this.bindUIElements();
        this.triggerMethod('render:template');
      },
      attachElContent: function(html) {
        this.$el.html(html);
        return this;
      },
      attachBuffer: function(compositeView, buffer) {
        var $container = this.getChildViewContainer(compositeView);
        $container.append(buffer);
      },
      _insertAfter: function(childView) {
        var $container = this.getChildViewContainer(this, childView);
        $container.append(childView.el);
      },
      _appendReorderedChildren: function(children) {
        var $container = this.getChildViewContainer(this);
        $container.append(children);
      },
      getChildViewContainer: function(containerView, childView) {
        if (!!containerView.$childViewContainer) {
          return containerView.$childViewContainer;
        }
        var container;
        var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
        if (childViewContainer) {
          var selector = Marionette._getValue(childViewContainer, containerView);
          if (selector.charAt(0) === '@' && containerView.ui) {
            container = containerView.ui[selector.substr(4)];
          } else {
            container = containerView.$(selector);
          }
          if (container.length <= 0) {
            throw new Marionette.Error({
              name: 'ChildViewContainerMissingError',
              message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
            });
          }
        } else {
          container = containerView.$el;
        }
        containerView.$childViewContainer = container;
        return container;
      },
      resetChildViewContainer: function() {
        if (this.$childViewContainer) {
          this.$childViewContainer = undefined;
        }
      }
    });
    Marionette.LayoutView = Marionette.ItemView.extend({
      regionClass: Marionette.Region,
      options: {destroyImmediate: false},
      childViewEventPrefix: 'childview',
      constructor: function(options) {
        options = options || {};
        this._firstRender = true;
        this._initializeRegions(options);
        Marionette.ItemView.call(this, options);
      },
      render: function() {
        this._ensureViewIsIntact();
        if (this._firstRender) {
          this._firstRender = false;
        } else {
          this._reInitializeRegions();
        }
        return Marionette.ItemView.prototype.render.apply(this, arguments);
      },
      destroy: function() {
        if (this.isDestroyed) {
          return this;
        }
        if (this.getOption('destroyImmediate') === true) {
          this.$el.remove();
        }
        this.regionManager.destroy();
        return Marionette.ItemView.prototype.destroy.apply(this, arguments);
      },
      showChildView: function(regionName, view, options) {
        var region = this.getRegion(regionName);
        return region.show.apply(region, _.rest(arguments));
      },
      getChildView: function(regionName) {
        return this.getRegion(regionName).currentView;
      },
      addRegion: function(name, definition) {
        var regions = {};
        regions[name] = definition;
        return this._buildRegions(regions)[name];
      },
      addRegions: function(regions) {
        this.regions = _.extend({}, this.regions, regions);
        return this._buildRegions(regions);
      },
      removeRegion: function(name) {
        delete this.regions[name];
        return this.regionManager.removeRegion(name);
      },
      getRegion: function(region) {
        return this.regionManager.get(region);
      },
      getRegions: function() {
        return this.regionManager.getRegions();
      },
      _buildRegions: function(regions) {
        var defaults = {
          regionClass: this.getOption('regionClass'),
          parentEl: _.partial(_.result, this, 'el')
        };
        return this.regionManager.addRegions(regions, defaults);
      },
      _initializeRegions: function(options) {
        var regions;
        this._initRegionManager();
        regions = Marionette._getValue(this.regions, this, [options]) || {};
        var regionOptions = this.getOption.call(options, 'regions');
        regionOptions = Marionette._getValue(regionOptions, this, [options]);
        _.extend(regions, regionOptions);
        regions = this.normalizeUIValues(regions, ['selector', 'el']);
        this.addRegions(regions);
      },
      _reInitializeRegions: function() {
        this.regionManager.invoke('reset');
      },
      getRegionManager: function() {
        return new Marionette.RegionManager();
      },
      _initRegionManager: function() {
        this.regionManager = this.getRegionManager();
        this.regionManager._parent = this;
        this.listenTo(this.regionManager, 'before:add:region', function(name) {
          this.triggerMethod('before:add:region', name);
        });
        this.listenTo(this.regionManager, 'add:region', function(name, region) {
          this[name] = region;
          this.triggerMethod('add:region', name, region);
        });
        this.listenTo(this.regionManager, 'before:remove:region', function(name) {
          this.triggerMethod('before:remove:region', name);
        });
        this.listenTo(this.regionManager, 'remove:region', function(name, region) {
          delete this[name];
          this.triggerMethod('remove:region', name, region);
        });
      },
      _getImmediateChildren: function() {
        return _.chain(this.regionManager.getRegions()).pluck('currentView').compact().value();
      }
    });
    Marionette.Behavior = Marionette.Object.extend({
      constructor: function(options, view) {
        this.view = view;
        this.defaults = _.result(this, 'defaults') || {};
        this.options = _.extend({}, this.defaults, options);
        this.ui = _.extend({}, _.result(view, 'ui'), _.result(this, 'ui'));
        Marionette.Object.apply(this, arguments);
      },
      $: function() {
        return this.view.$.apply(this.view, arguments);
      },
      destroy: function() {
        this.stopListening();
        return this;
      },
      proxyViewProperties: function(view) {
        this.$el = view.$el;
        this.el = view.el;
      }
    });
    Marionette.Behaviors = (function(Marionette, _) {
      var delegateEventSplitter = /^(\S+)\s*(.*)$/;
      function Behaviors(view, behaviors) {
        if (!_.isObject(view.behaviors)) {
          return {};
        }
        behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));
        Behaviors.wrap(view, behaviors, _.keys(methods));
        return behaviors;
      }
      var methods = {
        behaviorTriggers: function(behaviorTriggers, behaviors) {
          var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
          return triggerBuilder.buildBehaviorTriggers();
        },
        behaviorEvents: function(behaviorEvents, behaviors) {
          var _behaviorsEvents = {};
          _.each(behaviors, function(b, i) {
            var _events = {};
            var behaviorEvents = _.clone(_.result(b, 'events')) || {};
            behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, getBehaviorsUI(b));
            var j = 0;
            _.each(behaviorEvents, function(behaviour, key) {
              var match = key.match(delegateEventSplitter);
              var eventName = match[1] + '.' + [this.cid, i, j++, ' '].join('');
              var selector = match[2];
              var eventKey = eventName + selector;
              var handler = _.isFunction(behaviour) ? behaviour : b[behaviour];
              if (!handler) {
                return;
              }
              _events[eventKey] = _.bind(handler, b);
            }, this);
            _behaviorsEvents = _.extend(_behaviorsEvents, _events);
          }, this);
          return _behaviorsEvents;
        }
      };
      _.extend(Behaviors, {
        behaviorsLookup: function() {
          throw new Marionette.Error({
            message: 'You must define where your behaviors are stored.',
            url: 'marionette.behaviors.html#behaviorslookup'
          });
        },
        getBehaviorClass: function(options, key) {
          if (options.behaviorClass) {
            return options.behaviorClass;
          }
          return Marionette._getValue(Behaviors.behaviorsLookup, this, [options, key])[key];
        },
        parseBehaviors: function(view, behaviors) {
          return _.chain(behaviors).map(function(options, key) {
            var BehaviorClass = Behaviors.getBehaviorClass(options, key);
            var behavior = new BehaviorClass(options, view);
            var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));
            return [behavior].concat(nestedBehaviors);
          }).flatten().value();
        },
        wrap: function(view, behaviors, methodNames) {
          _.each(methodNames, function(methodName) {
            view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
          });
        }
      });
      function BehaviorTriggersBuilder(view, behaviors) {
        this._view = view;
        this._behaviors = behaviors;
        this._triggers = {};
      }
      _.extend(BehaviorTriggersBuilder.prototype, {
        buildBehaviorTriggers: function() {
          _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
          return this._triggers;
        },
        _buildTriggerHandlersForBehavior: function(behavior, i) {
          var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};
          triggersHash = Marionette.normalizeUIKeys(triggersHash, getBehaviorsUI(behavior));
          _.each(triggersHash, _.bind(this._setHandlerForBehavior, this, behavior, i));
        },
        _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
          var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
            return triggerName + '.' + 'behaviortriggers' + i;
          });
          this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
        }
      });
      function getBehaviorsUI(behavior) {
        return behavior._uiBindings || behavior.ui;
      }
      return Behaviors;
    })(Marionette, _);
    Marionette.AppRouter = Backbone.Router.extend({
      constructor: function(options) {
        this.options = options || {};
        Backbone.Router.apply(this, arguments);
        var appRoutes = this.getOption('appRoutes');
        var controller = this._getController();
        this.processAppRoutes(controller, appRoutes);
        this.on('route', this._processOnRoute, this);
      },
      appRoute: function(route, methodName) {
        var controller = this._getController();
        this._addAppRoute(controller, route, methodName);
      },
      _processOnRoute: function(routeName, routeArgs) {
        if (_.isFunction(this.onRoute)) {
          var routePath = _.invert(this.getOption('appRoutes'))[routeName];
          this.onRoute(routeName, routePath, routeArgs);
        }
      },
      processAppRoutes: function(controller, appRoutes) {
        if (!appRoutes) {
          return;
        }
        var routeNames = _.keys(appRoutes).reverse();
        _.each(routeNames, function(route) {
          this._addAppRoute(controller, route, appRoutes[route]);
        }, this);
      },
      _getController: function() {
        return this.getOption('controller');
      },
      _addAppRoute: function(controller, route, methodName) {
        var method = controller[methodName];
        if (!method) {
          throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
        }
        this.route(route, methodName, _.bind(method, controller));
      },
      mergeOptions: Marionette.mergeOptions,
      getOption: Marionette.proxyGetOption,
      triggerMethod: Marionette.triggerMethod,
      bindEntityEvents: Marionette.proxyBindEntityEvents,
      unbindEntityEvents: Marionette.proxyUnbindEntityEvents
    });
    Marionette.Application = Marionette.Object.extend({
      constructor: function(options) {
        this._initializeRegions(options);
        this._initCallbacks = new Marionette.Callbacks();
        this.submodules = {};
        _.extend(this, options);
        this._initChannel();
        Marionette.Object.apply(this, arguments);
      },
      execute: function() {
        this.commands.execute.apply(this.commands, arguments);
      },
      request: function() {
        return this.reqres.request.apply(this.reqres, arguments);
      },
      addInitializer: function(initializer) {
        this._initCallbacks.add(initializer);
      },
      start: function(options) {
        this.triggerMethod('before:start', options);
        this._initCallbacks.run(options, this);
        this.triggerMethod('start', options);
      },
      addRegions: function(regions) {
        return this._regionManager.addRegions(regions);
      },
      emptyRegions: function() {
        return this._regionManager.emptyRegions();
      },
      removeRegion: function(region) {
        return this._regionManager.removeRegion(region);
      },
      getRegion: function(region) {
        return this._regionManager.get(region);
      },
      getRegions: function() {
        return this._regionManager.getRegions();
      },
      module: function(moduleNames, moduleDefinition) {
        var ModuleClass = Marionette.Module.getClass(moduleDefinition);
        var args = _.toArray(arguments);
        args.unshift(this);
        return ModuleClass.create.apply(ModuleClass, args);
      },
      getRegionManager: function() {
        return new Marionette.RegionManager();
      },
      _initializeRegions: function(options) {
        var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
        this._initRegionManager();
        var optionRegions = Marionette.getOption(options, 'regions');
        if (_.isFunction(optionRegions)) {
          optionRegions = optionRegions.call(this, options);
        }
        _.extend(regions, optionRegions);
        this.addRegions(regions);
        return this;
      },
      _initRegionManager: function() {
        this._regionManager = this.getRegionManager();
        this._regionManager._parent = this;
        this.listenTo(this._regionManager, 'before:add:region', function() {
          Marionette._triggerMethod(this, 'before:add:region', arguments);
        });
        this.listenTo(this._regionManager, 'add:region', function(name, region) {
          this[name] = region;
          Marionette._triggerMethod(this, 'add:region', arguments);
        });
        this.listenTo(this._regionManager, 'before:remove:region', function() {
          Marionette._triggerMethod(this, 'before:remove:region', arguments);
        });
        this.listenTo(this._regionManager, 'remove:region', function(name) {
          delete this[name];
          Marionette._triggerMethod(this, 'remove:region', arguments);
        });
      },
      _initChannel: function() {
        this.channelName = _.result(this, 'channelName') || 'global';
        this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
        this.vent = _.result(this, 'vent') || this.channel.vent;
        this.commands = _.result(this, 'commands') || this.channel.commands;
        this.reqres = _.result(this, 'reqres') || this.channel.reqres;
      }
    });
    Marionette.Module = function(moduleName, app, options) {
      this.moduleName = moduleName;
      this.options = _.extend({}, this.options, options);
      this.initialize = options.initialize || this.initialize;
      this.submodules = {};
      this._setupInitializersAndFinalizers();
      this.app = app;
      if (_.isFunction(this.initialize)) {
        this.initialize(moduleName, app, this.options);
      }
    };
    Marionette.Module.extend = Marionette.extend;
    _.extend(Marionette.Module.prototype, Backbone.Events, {
      startWithParent: true,
      initialize: function() {},
      addInitializer: function(callback) {
        this._initializerCallbacks.add(callback);
      },
      addFinalizer: function(callback) {
        this._finalizerCallbacks.add(callback);
      },
      start: function(options) {
        if (this._isInitialized) {
          return;
        }
        _.each(this.submodules, function(mod) {
          if (mod.startWithParent) {
            mod.start(options);
          }
        });
        this.triggerMethod('before:start', options);
        this._initializerCallbacks.run(options, this);
        this._isInitialized = true;
        this.triggerMethod('start', options);
      },
      stop: function() {
        if (!this._isInitialized) {
          return;
        }
        this._isInitialized = false;
        this.triggerMethod('before:stop');
        _.invoke(this.submodules, 'stop');
        this._finalizerCallbacks.run(undefined, this);
        this._initializerCallbacks.reset();
        this._finalizerCallbacks.reset();
        this.triggerMethod('stop');
      },
      addDefinition: function(moduleDefinition, customArgs) {
        this._runModuleDefinition(moduleDefinition, customArgs);
      },
      _runModuleDefinition: function(definition, customArgs) {
        if (!definition) {
          return;
        }
        var args = _.flatten([this, this.app, Backbone, Marionette, Backbone.$, _, customArgs]);
        definition.apply(this, args);
      },
      _setupInitializersAndFinalizers: function() {
        this._initializerCallbacks = new Marionette.Callbacks();
        this._finalizerCallbacks = new Marionette.Callbacks();
      },
      triggerMethod: Marionette.triggerMethod
    });
    _.extend(Marionette.Module, {
      create: function(app, moduleNames, moduleDefinition) {
        var module = app;
        var customArgs = _.drop(arguments, 3);
        moduleNames = moduleNames.split('.');
        var length = moduleNames.length;
        var moduleDefinitions = [];
        moduleDefinitions[length - 1] = moduleDefinition;
        _.each(moduleNames, function(moduleName, i) {
          var parentModule = module;
          module = this._getModule(parentModule, moduleName, app, moduleDefinition);
          this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
        }, this);
        return module;
      },
      _getModule: function(parentModule, moduleName, app, def, args) {
        var options = _.extend({}, def);
        var ModuleClass = this.getClass(def);
        var module = parentModule[moduleName];
        if (!module) {
          module = new ModuleClass(moduleName, app, options);
          parentModule[moduleName] = module;
          parentModule.submodules[moduleName] = module;
        }
        return module;
      },
      getClass: function(moduleDefinition) {
        var ModuleClass = Marionette.Module;
        if (!moduleDefinition) {
          return ModuleClass;
        }
        if (moduleDefinition.prototype instanceof ModuleClass) {
          return moduleDefinition;
        }
        return moduleDefinition.moduleClass || ModuleClass;
      },
      _addModuleDefinition: function(parentModule, module, def, args) {
        var fn = this._getDefine(def);
        var startWithParent = this._getStartWithParent(def, module);
        if (fn) {
          module.addDefinition(fn, args);
        }
        this._addStartWithParent(parentModule, module, startWithParent);
      },
      _getStartWithParent: function(def, module) {
        var swp;
        if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
          swp = module.constructor.prototype.startWithParent;
          return _.isUndefined(swp) ? true : swp;
        }
        if (_.isObject(def)) {
          swp = def.startWithParent;
          return _.isUndefined(swp) ? true : swp;
        }
        return true;
      },
      _getDefine: function(def) {
        if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
          return def;
        }
        if (_.isObject(def)) {
          return def.define;
        }
        return null;
      },
      _addStartWithParent: function(parentModule, module, startWithParent) {
        module.startWithParent = module.startWithParent && startWithParent;
        if (!module.startWithParent || !!module.startWithParentIsConfigured) {
          return;
        }
        module.startWithParentIsConfigured = true;
        parentModule.addInitializer(function(options) {
          if (module.startWithParent) {
            module.start(options);
          }
        });
      }
    });
    return Marionette;
  }));
})(require('process'));
