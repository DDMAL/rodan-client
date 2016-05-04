/* */ 
(function(process) {
  global = this;
  (function(modules) {
    var bundle = {};
    var main;
    for (var i = 0; i < modules.length; i++) {
      var module = modules[i];
      module = modules[i] = new Module(module[0], module[1], module[2], module[3], module[4]);
      bundle[module.filename] = module;
    }
    function Module(id, dirname, basename, dependencies, factory) {
      this.id = id;
      this.dirname = dirname;
      this.filename = dirname + "/" + basename;
      this.dependencies = dependencies;
      this.factory = factory;
    }
    Module.prototype._require = function() {
      var module = this;
      if (module.exports === void 0) {
        module.exports = {};
        var require = function(id) {
          var index = module.dependencies[id];
          var dependency = modules[index];
          if (!dependency)
            throw new Error("Bundle is missing a dependency: " + id);
          return dependency._require();
        };
        require.main = main;
        module.exports = module.factory(require, module.exports, module, module.filename, module.dirname) || module.exports;
      }
      return module.exports;
    };
    Module.prototype.modules = bundle;
    return function require(filename) {
      main = bundle[filename];
      main._require();
    };
  })([["browser-asap.js", "asap", "browser-asap.js", {"./raw": 1}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var rawAsap = require('./raw');
    var freeTasks = [];
    var pendingErrors = [];
    var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
    function throwFirstError() {
      if (pendingErrors.length) {
        throw pendingErrors.shift();
      }
    }
    module.exports = asap;
    function asap(task) {
      var rawTask;
      if (freeTasks.length) {
        rawTask = freeTasks.pop();
      } else {
        rawTask = new RawTask();
      }
      rawTask.task = task;
      rawAsap(rawTask);
    }
    function RawTask() {
      this.task = null;
    }
    RawTask.prototype.call = function() {
      try {
        this.task.call();
      } catch (error) {
        if (asap.onerror) {
          asap.onerror(error);
        } else {
          pendingErrors.push(error);
          requestErrorThrow();
        }
      } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
      }
    };
  }], ["browser-raw.js", "asap", "browser-raw.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = rawAsap;
    function rawAsap(task) {
      if (!queue.length) {
        requestFlush();
        flushing = true;
      }
      queue[queue.length] = task;
    }
    var queue = [];
    var flushing = false;
    var requestFlush;
    var index = 0;
    var capacity = 1024;
    function flush() {
      while (index < queue.length) {
        var currentIndex = index;
        index = index + 1;
        queue[currentIndex].call();
        if (index > capacity) {
          for (var scan = 0,
              newLength = queue.length - index; scan < newLength; scan++) {
            queue[scan] = queue[scan + index];
          }
          queue.length -= index;
          index = 0;
        }
      }
      queue.length = 0;
      index = 0;
      flushing = false;
    }
    var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
    if (typeof BrowserMutationObserver === "function") {
      requestFlush = makeRequestCallFromMutationObserver(flush);
    } else {
      requestFlush = makeRequestCallFromTimer(flush);
    }
    rawAsap.requestFlush = requestFlush;
    function makeRequestCallFromMutationObserver(callback) {
      var toggle = 1;
      var observer = new BrowserMutationObserver(callback);
      var node = document.createTextNode("");
      observer.observe(node, {characterData: true});
      return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
      };
    }
    function makeRequestCallFromTimer(callback) {
      return function requestCall() {
        var timeoutHandle = setTimeout(handleTimer, 0);
        var intervalHandle = setInterval(handleTimer, 50);
        function handleTimer() {
          clearTimeout(timeoutHandle);
          clearInterval(intervalHandle);
          callback();
        }
      };
    }
    rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
  }], ["array-iterator.js", "pop-iterate", "array-iterator.js", {"./iteration": 3}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var Iteration = require('./iteration');
    module.exports = ArrayIterator;
    function ArrayIterator(iterable, start, stop, step) {
      this.array = iterable;
      this.start = start || 0;
      this.stop = stop || Infinity;
      this.step = step || 1;
    }
    ArrayIterator.prototype.next = function() {
      var iteration;
      if (this.start < Math.min(this.array.length, this.stop)) {
        iteration = new Iteration(this.array[this.start], false, this.start);
        this.start += this.step;
      } else {
        iteration = new Iteration(undefined, true);
      }
      return iteration;
    };
  }], ["iteration.js", "pop-iterate", "iteration.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = Iteration;
    function Iteration(value, done, index) {
      this.value = value;
      this.done = done;
      this.index = index;
    }
    Iteration.prototype.equals = function(other) {
      return (typeof other == 'object' && other.value === this.value && other.done === this.done && other.index === this.index);
    };
  }], ["object-iterator.js", "pop-iterate", "object-iterator.js", {
    "./iteration": 3,
    "./array-iterator": 2
  }, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var Iteration = require('./iteration');
    var ArrayIterator = require('./array-iterator');
    module.exports = ObjectIterator;
    function ObjectIterator(iterable, start, stop, step) {
      this.object = iterable;
      this.keysIterator = new ArrayIterator(Object.keys(iterable), start, stop, step);
    }
    ObjectIterator.prototype.next = function() {
      var iteration = this.keysIterator.next();
      if (iteration.done) {
        return iteration;
      }
      var key = iteration.value;
      return new Iteration(this.object[key], false, key);
    };
  }], ["pop-iterate.js", "pop-iterate", "pop-iterate.js", {
    "./array-iterator": 2,
    "./object-iterator": 4
  }, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var ArrayIterator = require('./array-iterator');
    var ObjectIterator = require('./object-iterator');
    module.exports = iterate;
    function iterate(iterable, start, stop, step) {
      if (!iterable) {
        return empty;
      } else if (Array.isArray(iterable)) {
        return new ArrayIterator(iterable, start, stop, step);
      } else if (typeof iterable.next === "function") {
        return iterable;
      } else if (typeof iterable.iterate === "function") {
        return iterable.iterate(start, stop, step);
      } else if (typeof iterable === "object") {
        return new ObjectIterator(iterable);
      } else {
        throw new TypeError("Can't iterate " + iterable);
      }
    }
  }], ["q.js", "q", "q.js", {
    "weak-map": 17,
    "pop-iterate": 5,
    "asap": 0
  }, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var hasStacks = false;
    try {
      throw new Error();
    } catch (e) {
      hasStacks = !!e.stack;
    }
    var qStartingLine = captureLine();
    var qFileName;
    var WeakMap = require('weak-map');
    var iterate = require('pop-iterate');
    var asap = require('asap');
    function isObject(value) {
      return value === Object(value);
    }
    var STACK_JUMP_SEPARATOR = "From previous event:";
    function makeStackTraceLong(error, promise) {
      if (hasStacks && promise.stack && typeof error === "object" && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
        var stacks = [];
        for (var p = promise; !!p && handlers.get(p); p = handlers.get(p).became) {
          if (p.stack) {
            stacks.unshift(p.stack);
          }
        }
        stacks.unshift(error.stack);
        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
      }
    }
    function filterStackString(stackString) {
      if (Q.isIntrospective) {
        return stackString;
      }
      var lines = stackString.split("\n");
      var desiredLines = [];
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
          desiredLines.push(line);
        }
      }
      return desiredLines.join("\n");
    }
    function isNodeFrame(stackLine) {
      return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1;
    }
    function getFileNameAndLineNumber(stackLine) {
      var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
      if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
      }
      var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
      if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
      }
      var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
      if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
      }
    }
    function isInternalFrame(stackLine) {
      var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
      if (!fileNameAndLineNumber) {
        return false;
      }
      var fileName = fileNameAndLineNumber[0];
      var lineNumber = fileNameAndLineNumber[1];
      return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
    }
    function captureLine() {
      if (!hasStacks) {
        return;
      }
      try {
        throw new Error();
      } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
          return;
        }
        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
      }
    }
    function deprecate(callback, name, alternative) {
      return function Q_deprecate() {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          if (alternative) {
            console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack);
          } else {
            console.warn(name + " is deprecated.", new Error("").stack);
          }
        }
        return callback.apply(this, arguments);
      };
    }
    var handlers = new WeakMap();
    function Q_getHandler(promise) {
      var handler = handlers.get(promise);
      if (!handler || !handler.became) {
        return handler;
      }
      handler = follow(handler);
      handlers.set(promise, handler);
      return handler;
    }
    function follow(handler) {
      if (!handler.became) {
        return handler;
      } else {
        handler.became = follow(handler.became);
        return handler.became;
      }
    }
    var theViciousCycleError = new Error("Can't resolve a promise with itself");
    var theViciousCycleRejection = Q_reject(theViciousCycleError);
    var theViciousCycle = Q_getHandler(theViciousCycleRejection);
    var thenables = new WeakMap();
    module.exports = Q;
    function Q(value) {
      if (Q_isPromise(value)) {
        return value;
      } else if (isThenable(value)) {
        if (!thenables.has(value)) {
          thenables.set(value, new Promise(new Thenable(value)));
        }
        return thenables.get(value);
      } else {
        return new Promise(new Fulfilled(value));
      }
    }
    Q.longStackSupport = false;
    Q.reject = Q_reject;
    function Q_reject(error) {
      return new Promise(new Rejected(error));
    }
    Q.defer = defer;
    function defer() {
      var handler = new Pending();
      var promise = new Promise(handler);
      var deferred = new Deferred(promise);
      if (Q.longStackSupport && hasStacks) {
        try {
          throw new Error();
        } catch (e) {
          promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
      }
      return deferred;
    }
    Q.when = function Q_when(value, fulfilled, rejected, ms) {
      return Q(value).then(fulfilled, rejected, ms);
    };
    Q.all = Q_all;
    function Q_all(questions) {
      if (Q_isPromise(questions)) {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn("Q.all no longer directly unwraps a promise. Use Q(array).all()");
        }
        return Q(questions).all();
      }
      var countDown = 0;
      var deferred = defer();
      var answers = Array(questions.length);
      var estimates = [];
      var estimate = -Infinity;
      var setEstimate;
      Array.prototype.forEach.call(questions, function Q_all_each(promise, index) {
        var handler;
        if (Q_isPromise(promise) && (handler = Q_getHandler(promise)).state === "fulfilled") {
          answers[index] = handler.value;
        } else {
          ++countDown;
          promise = Q(promise);
          promise.then(function Q_all_eachFulfilled(value) {
            answers[index] = value;
            if (--countDown === 0) {
              deferred.resolve(answers);
            }
          }, deferred.reject);
          promise.observeEstimate(function Q_all_eachEstimate(newEstimate) {
            var oldEstimate = estimates[index];
            estimates[index] = newEstimate;
            if (newEstimate > estimate) {
              estimate = newEstimate;
            } else if (oldEstimate === estimate && newEstimate <= estimate) {
              computeEstimate();
            }
            if (estimates.length === questions.length && estimate !== setEstimate) {
              deferred.setEstimate(estimate);
              setEstimate = estimate;
            }
          });
        }
      });
      function computeEstimate() {
        estimate = -Infinity;
        for (var index = 0; index < estimates.length; index++) {
          if (estimates[index] > estimate) {
            estimate = estimates[index];
          }
        }
      }
      if (countDown === 0) {
        deferred.resolve(answers);
      }
      return deferred.promise;
    }
    Q.allSettled = Q_allSettled;
    function Q_allSettled(questions) {
      if (Q_isPromise(questions)) {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn("Q.allSettled no longer directly unwraps a promise. Use Q(array).allSettled()");
        }
        return Q(questions).allSettled();
      }
      return Q_all(questions.map(function Q_allSettled_each(promise) {
        promise = Q(promise);
        function regardless() {
          return promise.inspect();
        }
        return promise.then(regardless, regardless);
      }));
    }
    Q.delay = function Q_delay(object, timeout) {
      if (timeout === void 0) {
        timeout = object;
        object = void 0;
      }
      return Q(object).delay(timeout);
    };
    Q.timeout = function Q_timeout(object, ms, message) {
      return Q(object).timeout(ms, message);
    };
    Q.spread = Q_spread;
    function Q_spread(value, fulfilled, rejected) {
      return Q(value).spread(fulfilled, rejected);
    }
    Q.join = function Q_join(x, y) {
      return Q.spread([x, y], function Q_joined(x, y) {
        if (x === y) {
          return x;
        } else {
          throw new Error("Can't join: not the same: " + x + " " + y);
        }
      });
    };
    Q.race = Q_race;
    function Q_race(answerPs) {
      return new Promise(function(deferred) {
        answerPs.forEach(function(answerP) {
          Q(answerP).then(deferred.resolve, deferred.reject);
        });
      });
    }
    Q.try = function Q_try(callback) {
      return Q(callback).dispatch("call", [[]]);
    };
    Q.function = Promise_function;
    function Promise_function(wrapped) {
      return function promiseFunctionWrapper() {
        var args = new Array(arguments.length);
        for (var index = 0; index < arguments.length; index++) {
          args[index] = arguments[index];
        }
        return Q(wrapped).apply(this, args);
      };
    }
    Q.promised = function Q_promised(callback) {
      return function promisedMethod() {
        var args = new Array(arguments.length);
        for (var index = 0; index < arguments.length; index++) {
          args[index] = arguments[index];
        }
        return Q_spread([this, Q_all(args)], function Q_promised_spread(self, args) {
          return callback.apply(self, args);
        });
      };
    };
    Q.passByCopy = Q.push = function(value) {
      if (Object(value) === value && !Q_isPromise(value)) {
        passByCopies.set(value, true);
      }
      return value;
    };
    Q.isPortable = function(value) {
      return Object(value) === value && passByCopies.has(value);
    };
    var passByCopies = new WeakMap();
    Q.async = Q_async;
    function Q_async(makeGenerator) {
      return function spawn() {
        function continuer(verb, arg) {
          var iteration;
          try {
            iteration = generator[verb](arg);
          } catch (exception) {
            return Q_reject(exception);
          }
          if (iteration.done) {
            return Q(iteration.value);
          } else {
            return Q(iteration.value).then(callback, errback);
          }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
      };
    }
    Q.spawn = Q_spawn;
    function Q_spawn(makeGenerator) {
      Q_async(makeGenerator)().done();
    }
    Q.Promise = Promise;
    function Promise(handler) {
      if (!(this instanceof Promise)) {
        return new Promise(handler);
      }
      if (typeof handler === "function") {
        var setup = handler;
        var deferred = defer();
        handler = Q_getHandler(deferred.promise);
        try {
          setup(deferred.resolve, deferred.reject, deferred.setEstimate);
        } catch (error) {
          deferred.reject(error);
        }
      }
      handlers.set(this, handler);
    }
    Promise.all = Q_all;
    Promise.race = Q_race;
    Promise.resolve = Promise_resolve;
    function Promise_resolve(value) {
      return Q(value);
    }
    Promise.reject = Q_reject;
    Q.isPromise = Q_isPromise;
    function Q_isPromise(object) {
      return isObject(object) && !!handlers.get(object);
    }
    function isThenable(object) {
      return isObject(object) && typeof object.then === "function";
    }
    Promise.prototype.inspect = function Promise_inspect() {
      return Q_getHandler(this).inspect();
    };
    Promise.prototype.isPending = function Promise_isPending() {
      return Q_getHandler(this).state === "pending";
    };
    Promise.prototype.isFulfilled = function Promise_isFulfilled() {
      return Q_getHandler(this).state === "fulfilled";
    };
    Promise.prototype.isRejected = function Promise_isRejected() {
      return Q_getHandler(this).state === "rejected";
    };
    Promise.prototype.toBePassed = function Promise_toBePassed() {
      return Q_getHandler(this).state === "passed";
    };
    Promise.prototype.toString = function Promise_toString() {
      return "[object Promise]";
    };
    Promise.prototype.then = function Promise_then(fulfilled, rejected, ms) {
      var self = this;
      var deferred = defer();
      var _fulfilled;
      if (typeof fulfilled === "function") {
        _fulfilled = function Promise_then_fulfilled(value) {
          try {
            deferred.resolve(fulfilled.call(void 0, value));
          } catch (error) {
            deferred.reject(error);
          }
        };
      } else {
        _fulfilled = deferred.resolve;
      }
      var _rejected;
      if (typeof rejected === "function") {
        _rejected = function Promise_then_rejected(error) {
          try {
            deferred.resolve(rejected.call(void 0, error));
          } catch (newError) {
            deferred.reject(newError);
          }
        };
      } else {
        _rejected = deferred.reject;
      }
      this.done(_fulfilled, _rejected);
      if (ms !== void 0) {
        var updateEstimate = function Promise_then_updateEstimate() {
          deferred.setEstimate(self.getEstimate() + ms);
        };
        this.observeEstimate(updateEstimate);
        updateEstimate();
      }
      return deferred.promise;
    };
    Promise.prototype.done = function Promise_done(fulfilled, rejected) {
      var self = this;
      var done = false;
      asap(function Promise_done_task() {
        var _fulfilled;
        if (typeof fulfilled === "function") {
          if (Q.onerror) {
            _fulfilled = function Promise_done_fulfilled(value) {
              if (done) {
                return;
              }
              done = true;
              try {
                fulfilled.call(void 0, value);
              } catch (error) {
                (Q.onerror || Promise_rethrow)(error);
              }
            };
          } else {
            _fulfilled = function Promise_done_fulfilled(value) {
              if (done) {
                return;
              }
              done = true;
              fulfilled.call(void 0, value);
            };
          }
        }
        var _rejected;
        if (typeof rejected === "function" && Q.onerror) {
          _rejected = function Promise_done_rejected(error) {
            if (done) {
              return;
            }
            done = true;
            makeStackTraceLong(error, self);
            try {
              rejected.call(void 0, error);
            } catch (newError) {
              (Q.onerror || Promise_rethrow)(newError);
            }
          };
        } else if (typeof rejected === "function") {
          _rejected = function Promise_done_rejected(error) {
            if (done) {
              return;
            }
            done = true;
            makeStackTraceLong(error, self);
            rejected.call(void 0, error);
          };
        } else {
          _rejected = Q.onerror || Promise_rethrow;
        }
        if (typeof process === "object" && process.domain) {
          _rejected = process.domain.bind(_rejected);
        }
        Q_getHandler(self).dispatch(_fulfilled, "then", [_rejected]);
      });
    };
    function Promise_rethrow(error) {
      throw error;
    }
    Promise.prototype.thenResolve = function Promise_thenResolve(value) {
      value = Q(value);
      return Q_all([this, value]).then(function Promise_thenResolve_resolved() {
        return value;
      }, null, 0);
    };
    Promise.prototype.thenReject = function Promise_thenReject(error) {
      return this.then(function Promise_thenReject_resolved() {
        throw error;
      }, null, 0);
    };
    Promise.prototype.all = function Promise_all() {
      return this.then(Q_all);
    };
    Promise.prototype.allSettled = function Promise_allSettled() {
      return this.then(Q_allSettled);
    };
    Promise.prototype.catch = function Promise_catch(rejected) {
      return this.then(void 0, rejected);
    };
    Promise.prototype.finally = function Promise_finally(callback, ms) {
      if (!callback) {
        return this;
      }
      callback = Q(callback);
      return this.then(function(value) {
        return callback.call().then(function Promise_finally_fulfilled() {
          return value;
        });
      }, function(reason) {
        return callback.call().then(function Promise_finally_rejected() {
          throw reason;
        });
      }, ms);
    };
    Promise.prototype.observeEstimate = function Promise_observeEstimate(emit) {
      this.rawDispatch(null, "estimate", [emit]);
      return this;
    };
    Promise.prototype.getEstimate = function Promise_getEstimate() {
      return Q_getHandler(this).estimate;
    };
    Promise.prototype.dispatch = function Promise_dispatch(op, args) {
      var deferred = defer();
      this.rawDispatch(deferred.resolve, op, args);
      return deferred.promise;
    };
    Promise.prototype.rawDispatch = function Promise_rawDispatch(resolve, op, args) {
      var self = this;
      asap(function Promise_dispatch_task() {
        Q_getHandler(self).dispatch(resolve, op, args);
      });
    };
    Promise.prototype.get = function Promise_get(name) {
      return this.dispatch("get", [name]);
    };
    Promise.prototype.invoke = function Promise_invoke(name) {
      var args = new Array(arguments.length - 1);
      for (var index = 1; index < arguments.length; index++) {
        args[index - 1] = arguments[index];
      }
      return this.dispatch("invoke", [name, args]);
    };
    Promise.prototype.apply = function Promise_apply(thisp, args) {
      return this.dispatch("call", [args, thisp]);
    };
    Promise.prototype.call = function Promise_call(thisp) {
      var args = new Array(Math.max(0, arguments.length - 1));
      for (var index = 1; index < arguments.length; index++) {
        args[index - 1] = arguments[index];
      }
      return this.dispatch("call", [args, thisp]);
    };
    Promise.prototype.bind = function Promise_bind(thisp) {
      var self = this;
      var args = new Array(Math.max(0, arguments.length - 1));
      for (var index = 1; index < arguments.length; index++) {
        args[index - 1] = arguments[index];
      }
      return function Promise_bind_bound() {
        var boundArgs = args.slice();
        for (var index = 0; index < arguments.length; index++) {
          boundArgs[boundArgs.length] = arguments[index];
        }
        return self.dispatch("call", [boundArgs, thisp]);
      };
    };
    Promise.prototype.keys = function Promise_keys() {
      return this.dispatch("keys", []);
    };
    Promise.prototype.iterate = function Promise_iterate() {
      return this.dispatch("iterate", []);
    };
    Promise.prototype.spread = function Promise_spread(fulfilled, rejected, ms) {
      return this.all().then(function Promise_spread_fulfilled(array) {
        return fulfilled.apply(void 0, array);
      }, rejected, ms);
    };
    Promise.prototype.timeout = function Promsie_timeout(ms, message) {
      var deferred = defer();
      var timeoutId = setTimeout(function Promise_timeout_task() {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
      }, ms);
      this.then(function Promise_timeout_fulfilled(value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
      }, function Promise_timeout_rejected(error) {
        clearTimeout(timeoutId);
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Promise.prototype.delay = function Promise_delay(ms) {
      return this.then(function Promise_delay_fulfilled(value) {
        var deferred = defer();
        deferred.setEstimate(Date.now() + ms);
        setTimeout(function Promise_delay_task() {
          deferred.resolve(value);
        }, ms);
        return deferred.promise;
      }, null, ms);
    };
    Promise.prototype.pull = function Promise_pull() {
      return this.dispatch("pull", []);
    };
    Promise.prototype.pass = function Promise_pass() {
      if (!this.toBePassed()) {
        return new Promise(new Passed(this));
      } else {
        return this;
      }
    };
    var promises = new WeakMap();
    function Deferred(promise) {
      this.promise = promise;
      promises.set(this, promise);
      var self = this;
      var resolve = this.resolve;
      this.resolve = function(value) {
        resolve.call(self, value);
      };
      var reject = this.reject;
      this.reject = function(error) {
        reject.call(self, error);
      };
    }
    Deferred.prototype.resolve = function Deferred_resolve(value) {
      var handler = Q_getHandler(promises.get(this));
      if (!handler.messages) {
        return;
      }
      handler.become(Q(value));
    };
    Deferred.prototype.reject = function Deferred_reject(reason) {
      var handler = Q_getHandler(promises.get(this));
      if (!handler.messages) {
        return;
      }
      handler.become(Q_reject(reason));
    };
    Deferred.prototype.setEstimate = function Deferred_setEstimate(estimate) {
      estimate = +estimate;
      if (estimate !== estimate) {
        estimate = Infinity;
      }
      if (estimate < 1e12 && estimate !== -Infinity) {
        throw new Error("Estimate values should be a number of miliseconds in the future");
      }
      var handler = Q_getHandler(promises.get(this));
      if (handler.setEstimate) {
        handler.setEstimate(estimate);
      }
    };
    function Fulfilled(value) {
      this.value = value;
      this.estimate = Date.now();
    }
    Fulfilled.prototype.state = "fulfilled";
    Fulfilled.prototype.inspect = function Fulfilled_inspect() {
      return {
        state: "fulfilled",
        value: this.value
      };
    };
    Fulfilled.prototype.dispatch = function Fulfilled_dispatch(resolve, op, operands) {
      var result;
      if (op === "then" || op === "get" || op === "call" || op === "invoke" || op === "keys" || op === "iterate" || op === "pull") {
        try {
          result = this[op].apply(this, operands);
        } catch (exception) {
          result = Q_reject(exception);
        }
      } else if (op === "estimate") {
        operands[0].call(void 0, this.estimate);
      } else {
        var error = new Error("Fulfilled promises do not support the " + op + " operator");
        result = Q_reject(error);
      }
      if (resolve) {
        resolve(result);
      }
    };
    Fulfilled.prototype.then = function Fulfilled_then() {
      return this.value;
    };
    Fulfilled.prototype.get = function Fulfilled_get(name) {
      return this.value[name];
    };
    Fulfilled.prototype.call = function Fulfilled_call(args, thisp) {
      return this.callInvoke(this.value, args, thisp);
    };
    Fulfilled.prototype.invoke = function Fulfilled_invoke(name, args) {
      return this.callInvoke(this.value[name], args, this.value);
    };
    Fulfilled.prototype.callInvoke = function Fulfilled_callInvoke(callback, args, thisp) {
      var waitToBePassed;
      for (var index = 0; index < args.length; index++) {
        if (Q_isPromise(args[index]) && args[index].toBePassed()) {
          waitToBePassed = waitToBePassed || [];
          waitToBePassed.push(args[index]);
        }
      }
      if (waitToBePassed) {
        var self = this;
        return Q_all(waitToBePassed).then(function() {
          return self.callInvoke(callback, args.map(function(arg) {
            if (Q_isPromise(arg) && arg.toBePassed()) {
              return arg.inspect().value;
            } else {
              return arg;
            }
          }), thisp);
        });
      } else {
        return callback.apply(thisp, args);
      }
    };
    Fulfilled.prototype.keys = function Fulfilled_keys() {
      return Object.keys(this.value);
    };
    Fulfilled.prototype.iterate = function Fulfilled_iterate() {
      return iterate(this.value);
    };
    Fulfilled.prototype.pull = function Fulfilled_pull() {
      var result;
      if (Object(this.value) === this.value) {
        result = Array.isArray(this.value) ? [] : {};
        for (var name in this.value) {
          result[name] = this.value[name];
        }
      } else {
        result = this.value;
      }
      return Q.push(result);
    };
    function Rejected(reason) {
      this.reason = reason;
      this.estimate = Infinity;
    }
    Rejected.prototype.state = "rejected";
    Rejected.prototype.inspect = function Rejected_inspect() {
      return {
        state: "rejected",
        reason: this.reason
      };
    };
    Rejected.prototype.dispatch = function Rejected_dispatch(resolve, op, operands) {
      var result;
      if (op === "then") {
        result = this.then(resolve, operands[0]);
      } else {
        result = this;
      }
      if (resolve) {
        resolve(result);
      }
    };
    Rejected.prototype.then = function Rejected_then(resolve, rejected) {
      return rejected ? rejected(this.reason) : this;
    };
    function Pending() {
      this.messages = [];
      this.observers = [];
      this.estimate = Infinity;
    }
    Pending.prototype.state = "pending";
    Pending.prototype.inspect = function Pending_inspect() {
      return {state: "pending"};
    };
    Pending.prototype.dispatch = function Pending_dispatch(resolve, op, operands) {
      this.messages.push([resolve, op, operands]);
      if (op === "estimate") {
        this.observers.push(operands[0]);
        var self = this;
        asap(function Pending_dispatch_task() {
          operands[0].call(void 0, self.estimate);
        });
      }
    };
    Pending.prototype.become = function Pending_become(promise) {
      this.became = theViciousCycle;
      var handler = Q_getHandler(promise);
      this.became = handler;
      handlers.set(promise, handler);
      this.promise = void 0;
      this.messages.forEach(function Pending_become_eachMessage(message) {
        asap(function Pending_become_eachMessage_task() {
          var handler = Q_getHandler(promise);
          handler.dispatch.apply(handler, message);
        });
      });
      this.messages = void 0;
      this.observers = void 0;
    };
    Pending.prototype.setEstimate = function Pending_setEstimate(estimate) {
      if (this.observers) {
        var self = this;
        self.estimate = estimate;
        this.observers.forEach(function Pending_eachObserver(observer) {
          asap(function Pending_setEstimate_eachObserver_task() {
            observer.call(void 0, estimate);
          });
        });
      }
    };
    function Thenable(thenable) {
      this.thenable = thenable;
      this.became = null;
      this.estimate = Infinity;
    }
    Thenable.prototype.state = "thenable";
    Thenable.prototype.inspect = function Thenable_inspect() {
      return {state: "pending"};
    };
    Thenable.prototype.cast = function Thenable_cast() {
      if (!this.became) {
        var deferred = defer();
        var thenable = this.thenable;
        asap(function Thenable_cast_task() {
          try {
            thenable.then(deferred.resolve, deferred.reject);
          } catch (exception) {
            deferred.reject(exception);
          }
        });
        this.became = Q_getHandler(deferred.promise);
      }
      return this.became;
    };
    Thenable.prototype.dispatch = function Thenable_dispatch(resolve, op, args) {
      this.cast().dispatch(resolve, op, args);
    };
    function Passed(promise) {
      this.promise = promise;
    }
    Passed.prototype.state = "passed";
    Passed.prototype.inspect = function Passed_inspect() {
      return this.promise.inspect();
    };
    Passed.prototype.dispatch = function Passed_dispatch(resolve, op, args) {
      return this.promise.rawDispatch(resolve, op, args);
    };
    Q.ninvoke = function Q_ninvoke(object, name) {
      var args = new Array(Math.max(0, arguments.length - 1));
      for (var index = 2; index < arguments.length; index++) {
        args[index - 2] = arguments[index];
      }
      var deferred = Q.defer();
      args[index - 2] = deferred.makeNodeResolver();
      Q(object).dispatch("invoke", [name, args]).catch(deferred.reject);
      return deferred.promise;
    };
    Promise.prototype.ninvoke = function Promise_ninvoke(name) {
      var args = new Array(arguments.length);
      for (var index = 1; index < arguments.length; index++) {
        args[index - 1] = arguments[index];
      }
      var deferred = Q.defer();
      args[index - 1] = deferred.makeNodeResolver();
      this.dispatch("invoke", [name, args]).catch(deferred.reject);
      return deferred.promise;
    };
    Q.denodeify = function Q_denodeify(callback, pattern) {
      return function denodeified() {
        var args = new Array(arguments.length + 1);
        var index = 0;
        for (; index < arguments.length; index++) {
          args[index] = arguments[index];
        }
        var deferred = Q.defer();
        args[index] = deferred.makeNodeResolver(pattern);
        Q(callback).apply(this, args).catch(deferred.reject);
        return deferred.promise;
      };
    };
    Deferred.prototype.makeNodeResolver = function(unpack) {
      var resolve = this.resolve;
      if (unpack === true) {
        return function variadicNodebackToResolver(error) {
          if (error) {
            resolve(Q_reject(error));
          } else {
            var value = new Array(Math.max(0, arguments.length - 1));
            for (var index = 1; index < arguments.length; index++) {
              value[index - 1] = arguments[index];
            }
            resolve(value);
          }
        };
      } else if (unpack) {
        return function namedArgumentNodebackToResolver(error) {
          if (error) {
            resolve(Q_reject(error));
          } else {
            var value = {};
            for (var index = 0; index < unpack.length; index++) {
              value[unpack[index]] = arguments[index + 1];
            }
            resolve(value);
          }
        };
      } else {
        return function nodebackToResolver(error, value) {
          if (error) {
            resolve(Q_reject(error));
          } else {
            resolve(value);
          }
        };
      }
    };
    Promise.prototype.nodeify = function Promise_nodeify(nodeback) {
      if (nodeback) {
        this.done(function(value) {
          nodeback(null, value);
        }, nodeback);
      } else {
        return this;
      }
    };
    Q.nextTick = deprecate(asap, "nextTick", "asap package");
    Q.resolve = deprecate(Q, "resolve", "Q");
    Q.fulfill = deprecate(Q, "fulfill", "Q");
    Q.isPromiseAlike = deprecate(isThenable, "isPromiseAlike", "(not supported)");
    Q.fail = deprecate(function(value, rejected) {
      return Q(value).catch(rejected);
    }, "Q.fail", "Q(value).catch");
    Q.fin = deprecate(function(value, regardless) {
      return Q(value).finally(regardless);
    }, "Q.fin", "Q(value).finally");
    Q.progress = deprecate(function(value) {
      return value;
    }, "Q.progress", "no longer supported");
    Q.thenResolve = deprecate(function(promise, value) {
      return Q(promise).thenResolve(value);
    }, "thenResolve", "Q(value).thenResolve");
    Q.thenReject = deprecate(function(promise, reason) {
      return Q(promise).thenResolve(reason);
    }, "thenResolve", "Q(value).thenResolve");
    Q.isPending = deprecate(function(value) {
      return Q(value).isPending();
    }, "isPending", "Q(value).isPending");
    Q.isFulfilled = deprecate(function(value) {
      return Q(value).isFulfilled();
    }, "isFulfilled", "Q(value).isFulfilled");
    Q.isRejected = deprecate(function(value) {
      return Q(value).isRejected();
    }, "isRejected", "Q(value).isRejected");
    Q.master = deprecate(function(value) {
      return value;
    }, "master", "no longer necessary");
    Q.makePromise = function() {
      throw new Error("makePromise is no longer supported");
    };
    Q.dispatch = deprecate(function(value, op, operands) {
      return Q(value).dispatch(op, operands);
    }, "dispatch", "Q(value).dispatch");
    Q.get = deprecate(function(object, name) {
      return Q(object).get(name);
    }, "get", "Q(value).get");
    Q.keys = deprecate(function(object) {
      return Q(object).keys();
    }, "keys", "Q(value).keys");
    Q.post = deprecate(function(object, name, args) {
      return Q(object).post(name, args);
    }, "post", "Q(value).invoke (spread arguments)");
    Q.mapply = deprecate(function(object, name, args) {
      return Q(object).post(name, args);
    }, "post", "Q(value).invoke (spread arguments)");
    Q.send = deprecate(function(object, name) {
      return Q(object).post(name, Array.prototype.slice.call(arguments, 2));
    }, "send", "Q(value).invoke");
    Q.set = function() {
      throw new Error("Q.set no longer supported");
    };
    Q.delete = function() {
      throw new Error("Q.delete no longer supported");
    };
    Q.nearer = deprecate(function(value) {
      if (Q_isPromise(value) && value.isFulfilled()) {
        return value.inspect().value;
      } else {
        return value;
      }
    }, "nearer", "inspect().value (+nuances)");
    Q.fapply = deprecate(function(callback, args) {
      return Q(callback).dispatch("call", [args]);
    }, "fapply", "Q(callback).apply(thisp, args)");
    Q.fcall = deprecate(function(callback) {
      return Q(callback).dispatch("call", [Array.prototype.slice.call(arguments, 1)]);
    }, "fcall", "Q(callback).call(thisp, ...args)");
    Q.fbind = deprecate(function(object) {
      var promise = Q(object);
      var args = Array.prototype.slice.call(arguments, 1);
      return function fbound() {
        return promise.dispatch("call", [args.concat(Array.prototype.slice.call(arguments)), this]);
      };
    }, "fbind", "bind with thisp");
    Q.promise = deprecate(Promise, "promise", "Promise");
    Promise.prototype.fapply = deprecate(function(args) {
      return this.dispatch("call", [args]);
    }, "fapply", "apply with thisp");
    Promise.prototype.fcall = deprecate(function() {
      return this.dispatch("call", [Array.prototype.slice.call(arguments)]);
    }, "fcall", "try or call with thisp");
    Promise.prototype.fail = deprecate(function(rejected) {
      return this.catch(rejected);
    }, "fail", "catch");
    Promise.prototype.fin = deprecate(function(regardless) {
      return this.finally(regardless);
    }, "fin", "finally");
    Promise.prototype.set = function() {
      throw new Error("Promise set no longer supported");
    };
    Promise.prototype.delete = function() {
      throw new Error("Promise delete no longer supported");
    };
    Deferred.prototype.notify = deprecate(function() {}, "notify", "no longer supported");
    Promise.prototype.progress = deprecate(function() {
      return this;
    }, "progress", "no longer supported");
    Promise.prototype.mapply = deprecate(function(name, args) {
      return this.dispatch("invoke", [name, args]);
    }, "mapply", "invoke");
    Promise.prototype.fbind = deprecate(function() {
      return Q.fbind.apply(Q, [void 0].concat(Array.prototype.slice.call(arguments)));
    }, "fbind", "bind(thisp, ...args)");
    Promise.prototype.send = deprecate(function() {
      return this.dispatch("invoke", [name, Array.prototype.slice.call(arguments, 1)]);
    }, "send", "invoke");
    Promise.prototype.mcall = deprecate(function() {
      return this.dispatch("invoke", [name, Array.prototype.slice.call(arguments, 1)]);
    }, "mcall", "invoke");
    Promise.prototype.passByCopy = deprecate(function(value) {
      return value;
    }, "passByCopy", "Q.passByCopy");
    Q.nfapply = deprecate(function(callback, args) {
      var deferred = Q.defer();
      var nodeArgs = Array.prototype.slice.call(args);
      nodeArgs.push(deferred.makeNodeResolver());
      Q(callback).apply(this, nodeArgs).catch(deferred.reject);
      return deferred.promise;
    }, "nfapply");
    Promise.prototype.nfapply = deprecate(function(args) {
      return Q.nfapply(this, args);
    }, "nfapply");
    Q.nfcall = deprecate(function(callback) {
      var args = Array.prototype.slice.call(arguments, 1);
      return Q.nfapply(callback, args);
    }, "nfcall");
    Promise.prototype.nfcall = deprecate(function() {
      var args = new Array(arguments.length);
      for (var index = 0; index < arguments.length; index++) {
        args[index] = arguments[index];
      }
      return Q.nfapply(this, args);
    }, "nfcall");
    Q.nfbind = deprecate(function(callback) {
      var baseArgs = Array.prototype.slice.call(arguments, 1);
      return function() {
        var nodeArgs = baseArgs.concat(Array.prototype.slice.call(arguments));
        var deferred = Q.defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).apply(this, nodeArgs).catch(deferred.reject);
        return deferred.promise;
      };
    }, "nfbind", "denodeify (with caveats)");
    Promise.prototype.nfbind = deprecate(function() {
      var args = new Array(arguments.length);
      for (var index = 0; index < arguments.length; index++) {
        args[index] = arguments[index];
      }
      return Q.nfbind(this, args);
    }, "nfbind", "denodeify (with caveats)");
    Q.nbind = deprecate(function(callback, thisp) {
      var baseArgs = Array.prototype.slice.call(arguments, 2);
      return function() {
        var nodeArgs = baseArgs.concat(Array.prototype.slice.call(arguments));
        var deferred = Q.defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
          return callback.apply(thisp, arguments);
        }
        Q(bound).apply(this, nodeArgs).catch(deferred.reject);
        return deferred.promise;
      };
    }, "nbind", "denodeify (with caveats)");
    Q.npost = deprecate(function(object, name, nodeArgs) {
      var deferred = Q.defer();
      nodeArgs.push(deferred.makeNodeResolver());
      Q(object).dispatch("invoke", [name, nodeArgs]).catch(deferred.reject);
      return deferred.promise;
    }, "npost", "ninvoke (with spread arguments)");
    Promise.prototype.npost = deprecate(function(name, args) {
      return Q.npost(this, name, args);
    }, "npost", "Q.ninvoke (with caveats)");
    Q.nmapply = deprecate(Q.nmapply, "nmapply", "q/node nmapply");
    Promise.prototype.nmapply = deprecate(Promise.prototype.npost, "nmapply", "Q.nmapply");
    Q.nsend = deprecate(Q.ninvoke, "nsend", "q/node ninvoke");
    Q.nmcall = deprecate(Q.ninvoke, "nmcall", "q/node ninvoke");
    Promise.prototype.nsend = deprecate(Promise.prototype.ninvoke, "nsend", "q/node ninvoke");
    Promise.prototype.nmcall = deprecate(Promise.prototype.ninvoke, "nmcall", "q/node ninvoke");
    var qEndingLine = captureLine();
  }], ["boot-entry.js", "system", "boot-entry.js", {
    "./system": 8,
    "./url": 9,
    "q": 6,
    "./script-params": 16,
    "./identifier": 12
  }, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var System = require('./browser-system');
    var URL = require('./browser-url');
    var Q = require('q');
    var getParams = require('./script-params');
    var Identifier = require('./identifier');
    module.exports = boot;
    function boot(params) {
      params = params || getParams("boot.js");
      var moduleLocation = URL.resolve(window.location, ".");
      var systemLocation = URL.resolve(window.location, params.package || ".");
      var abs = "";
      if (moduleLocation.lastIndexOf(systemLocation, 0) === 0) {
        abs = moduleLocation.slice(systemLocation.length);
      }
      var rel = params.import || "";
      return System.load(systemLocation, {browser: true}).then(function onSystemLoaded(system) {
        window.system = system;
        return system.import(rel, abs);
      });
    }
    if (require.main === module) {
      boot().done();
    }
  }], ["browser-system.js", "system", "browser-system.js", {
    "q": 6,
    "./common-system": 10
  }, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var Q = require('q');
    var CommonSystem = require('./common-system');
    module.exports = BrowserSystem;
    function BrowserSystem(location, description, options) {
      var self = this;
      CommonSystem.call(self, location, description, options);
    }
    BrowserSystem.prototype = Object.create(CommonSystem.prototype);
    BrowserSystem.prototype.constructor = BrowserSystem;
    BrowserSystem.load = CommonSystem.load;
    BrowserSystem.prototype.read = function read(location, charset, contentType) {
      var request = new XMLHttpRequest();
      var response = Q.defer();
      function onload() {
        if (xhrSuccess(request)) {
          response.resolve(request.responseText);
        } else {
          onerror();
        }
      }
      function onerror() {
        var error = new Error("Can't XHR " + JSON.stringify(location));
        if (request.status === 404 || request.status === 0) {
          error.code = "ENOENT";
          error.notFound = true;
        }
        response.reject(error);
      }
      try {
        request.open("GET", location, true);
        if (contentType && request.overrideMimeType) {
          request.overrideMimeType(contentType);
        }
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            onload();
          }
        };
        request.onload = request.load = onload;
        request.onerror = request.error = onerror;
        request.send();
      } catch (exception) {
        response.reject(exception);
      }
      return response.promise;
    };
    function xhrSuccess(req) {
      return (req.status === 200 || (req.status === 0 && req.responseText));
    }
  }], ["browser-url.js", "system", "browser-url.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var head = document.querySelector("head"),
        baseElement = document.createElement("base"),
        relativeElement = document.createElement("a");
    baseElement.href = "";
    exports.resolve = function resolve(base, relative) {
      var currentBaseElement = head.querySelector("base");
      if (!currentBaseElement) {
        head.appendChild(baseElement);
        currentBaseElement = baseElement;
      }
      base = String(base);
      if (!/^[\w\-]+:/.test(base)) {
        throw new Error("Can't resolve from a relative location: " + JSON.stringify(base) + " " + JSON.stringify(relative));
      }
      var restore = currentBaseElement.href;
      currentBaseElement.href = base;
      relativeElement.href = relative;
      var resolved = relativeElement.href;
      currentBaseElement.href = restore;
      if (currentBaseElement === baseElement) {
        head.removeChild(currentBaseElement);
      }
      return resolved;
    };
  }], ["common-system.js", "system", "common-system.js", {
    "q": 6,
    "./url": 9,
    "./identifier": 12,
    "./module": 13,
    "./resource": 15,
    "./parse-dependencies": 14,
    "./compile": 11
  }, function(require, exports, module, __filename, __dirname) {
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
  }], ["compile.js", "system", "compile.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = compile;
    var globalEval = eval;
    if (global.navigator && global.navigator.userAgent.indexOf("Firefox") >= 0) {
      globalEval = new Function("_", "return eval(_)");
    }
    function compile(module) {
      var displayName = module.filename.replace(/[^\w\d]|^\d/g, "_");
      try {
        module.factory = globalEval("(function " + displayName + "(require, exports, module, __filename, __dirname) {" + module.text + "//*/\n})\n//@ sourceURL=" + module.system.location + module.id);
      } catch (exception) {
        exception.message = exception.message + " in " + module.filename;
        throw exception;
      }
      module.factory.displayName = module.filename;
    }
  }], ["identifier.js", "system", "identifier.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    exports.isAbsolute = isAbsolute;
    function isAbsolute(path) {
      return (path !== "" && path.lastIndexOf("./", 0) < 0 && path.lastIndexOf("../", 0) < 0);
    }
    exports.isBare = isBare;
    function isBare(id) {
      var lastSlash = id.lastIndexOf("/");
      return id.indexOf(".", lastSlash) < 0;
    }
    exports.head = head;
    function head(id) {
      var firstSlash = id.indexOf("/");
      if (firstSlash < 0) {
        return id;
      }
      return id.slice(0, firstSlash);
    }
    exports.tail = tail;
    function tail(id) {
      var firstSlash = id.indexOf("/");
      if (firstSlash < 0) {
        return "";
      }
      return id.slice(firstSlash + 1);
    }
    exports.extension = extension;
    function extension(id) {
      var lastSlash = id.lastIndexOf("/");
      var lastDot = id.lastIndexOf(".");
      if (lastDot <= lastSlash) {
        return "";
      }
      return id.slice(lastDot + 1);
    }
    exports.dirname = dirname;
    function dirname(id) {
      var lastSlash = id.lastIndexOf("/");
      if (lastSlash < 0) {
        return id;
      }
      return id.slice(0, lastSlash);
    }
    exports.basename = basename;
    function basename(id) {
      var lastSlash = id.lastIndexOf("/");
      if (lastSlash < 0) {
        return id;
      }
      return id.slice(lastSlash + 1);
    }
    exports.resolve = resolve;
    function resolve(rel, abs) {
      abs = abs || '';
      var source = rel.split("/");
      var target = [];
      var parts;
      if (source.length && source[0] === "." || source[0] === "..") {
        parts = abs.split("/");
        parts.pop();
        source.unshift.apply(source, parts);
      }
      for (var index = 0; index < source.length; index++) {
        if (source[index] === "..") {
          if (target.length) {
            target.pop();
          }
        } else if (source[index] !== "" && source[index] !== ".") {
          target.push(source[index]);
        }
      }
      return target.join("/");
    }
  }], ["module.js", "system", "module.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = Module;
    function Module() {
      this.id = null;
      this.extension = null;
      this.system = null;
      this.key = null;
      this.filename = null;
      this.dirname = null;
      this.exports = null;
      this.redirect = null;
      this.text = null;
      this.factory = null;
      this.dependencies = [];
      this.loadedPromise = null;
      this.index = null;
      this.bundled = false;
    }
  }], ["parse-dependencies.js", "system", "parse-dependencies.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = parseDependencies;
    function parseDependencies(text) {
      var dependsUpon = {};
      String(text).replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g, function(_, id) {
        dependsUpon[id] = true;
      });
      return Object.keys(dependsUpon);
    }
  }], ["resource.js", "system", "resource.js", {}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    module.exports = Resource;
    function Resource() {
      this.id = null;
      this.filename = null;
      this.dirname = null;
      this.key = null;
      this.location = null;
      this.system = null;
    }
  }], ["script-params.js", "system", "script-params.js", {"./url": 9}, function(require, exports, module, __filename, __dirname) {
    "use strict";
    var URL = require('./browser-url');
    module.exports = getParams;
    function getParams(scriptName) {
      var i,
          j,
          match,
          script,
          location,
          attr,
          name,
          re = new RegExp("^(.*)" + scriptName + "(?:[\\?\\.]|$)", "i");
      var params = {};
      var scripts = document.getElementsByTagName("script");
      for (i = 0; i < scripts.length; i++) {
        script = scripts[i];
        if (scriptName && script.src && (match = script.src.match(re))) {
          location = match[1];
        }
        if (location) {
          if (script.dataset) {
            for (name in script.dataset) {
              if (script.dataset.hasOwnProperty(name)) {
                params[name] = script.dataset[name];
              }
            }
          } else if (script.attributes) {
            var dataRe = /^data-(.*)$/,
                letterAfterDash = /-([a-z])/g,
                upperCaseChar = function(_, c) {
                  return c.toUpperCase();
                };
            for (j = 0; j < script.attributes.length; j++) {
              attr = script.attributes[j];
              match = attr.name.match(/^data-(.*)$/);
              if (match) {
                params[match[1].replace(letterAfterDash, upperCaseChar)] = attr.value;
              }
            }
          }
          script.parentNode.removeChild(script);
          params.location = location;
          break;
        }
      }
      return params;
    }
  }], ["weak-map.js", "weak-map", "weak-map.js", {}, function(require, exports, module, __filename, __dirname) {
    (function WeakMapModule() {
      "use strict";
      if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
        return;
      }
      function weakMapPermitHostObjects(map) {
        if (map.permitHostObjects___) {
          map.permitHostObjects___(weakMapPermitHostObjects);
        }
      }
      if (typeof ses !== 'undefined') {
        ses.weakMapPermitHostObjects = weakMapPermitHostObjects;
      }
      var doubleWeakMapCheckSilentFailure = false;
      if (typeof WeakMap === 'function') {
        var HostWeakMap = WeakMap;
        if (typeof navigator !== 'undefined' && /Firefox/.test(navigator.userAgent)) {} else {
          var testMap = new HostWeakMap();
          var testObject = Object.freeze({});
          testMap.set(testObject, 1);
          if (testMap.get(testObject) !== 1) {
            doubleWeakMapCheckSilentFailure = true;
          } else {
            module.exports = WeakMap;
            return;
          }
        }
      }
      var hop = Object.prototype.hasOwnProperty;
      var gopn = Object.getOwnPropertyNames;
      var defProp = Object.defineProperty;
      var isExtensible = Object.isExtensible;
      var HIDDEN_NAME_PREFIX = 'weakmap:';
      var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';
      if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function' && typeof ArrayBuffer === 'function' && typeof Uint8Array === 'function') {
        var ab = new ArrayBuffer(25);
        var u8s = new Uint8Array(ab);
        crypto.getRandomValues(u8s);
        HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' + Array.prototype.map.call(u8s, function(u8) {
          return (u8 % 36).toString(36);
        }).join('') + '___';
      }
      function isNotHiddenName(name) {
        return !(name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX && name.substr(name.length - 3) === '___');
      }
      defProp(Object, 'getOwnPropertyNames', {value: function fakeGetOwnPropertyNames(obj) {
          return gopn(obj).filter(isNotHiddenName);
        }});
      if ('getPropertyNames' in Object) {
        var originalGetPropertyNames = Object.getPropertyNames;
        defProp(Object, 'getPropertyNames', {value: function fakeGetPropertyNames(obj) {
            return originalGetPropertyNames(obj).filter(isNotHiddenName);
          }});
      }
      function getHiddenRecord(key) {
        if (key !== Object(key)) {
          throw new TypeError('Not an object: ' + key);
        }
        var hiddenRecord = key[HIDDEN_NAME];
        if (hiddenRecord && hiddenRecord.key === key) {
          return hiddenRecord;
        }
        if (!isExtensible(key)) {
          return void 0;
        }
        hiddenRecord = {key: key};
        try {
          defProp(key, HIDDEN_NAME, {
            value: hiddenRecord,
            writable: false,
            enumerable: false,
            configurable: false
          });
          return hiddenRecord;
        } catch (error) {
          return void 0;
        }
      }
      (function() {
        var oldFreeze = Object.freeze;
        defProp(Object, 'freeze', {value: function identifyingFreeze(obj) {
            getHiddenRecord(obj);
            return oldFreeze(obj);
          }});
        var oldSeal = Object.seal;
        defProp(Object, 'seal', {value: function identifyingSeal(obj) {
            getHiddenRecord(obj);
            return oldSeal(obj);
          }});
        var oldPreventExtensions = Object.preventExtensions;
        defProp(Object, 'preventExtensions', {value: function identifyingPreventExtensions(obj) {
            getHiddenRecord(obj);
            return oldPreventExtensions(obj);
          }});
      })();
      function constFunc(func) {
        func.prototype = null;
        return Object.freeze(func);
      }
      var calledAsFunctionWarningDone = false;
      function calledAsFunctionWarning() {
        if (!calledAsFunctionWarningDone && typeof console !== 'undefined') {
          calledAsFunctionWarningDone = true;
          console.warn('WeakMap should be invoked as new WeakMap(), not ' + 'WeakMap(). This will be an error in the future.');
        }
      }
      var nextId = 0;
      var OurWeakMap = function() {
        if (!(this instanceof OurWeakMap)) {
          calledAsFunctionWarning();
        }
        var keys = [];
        var values = [];
        var id = nextId++;
        function get___(key, opt_default) {
          var index;
          var hiddenRecord = getHiddenRecord(key);
          if (hiddenRecord) {
            return id in hiddenRecord ? hiddenRecord[id] : opt_default;
          } else {
            index = keys.indexOf(key);
            return index >= 0 ? values[index] : opt_default;
          }
        }
        function has___(key) {
          var hiddenRecord = getHiddenRecord(key);
          if (hiddenRecord) {
            return id in hiddenRecord;
          } else {
            return keys.indexOf(key) >= 0;
          }
        }
        function set___(key, value) {
          var index;
          var hiddenRecord = getHiddenRecord(key);
          if (hiddenRecord) {
            hiddenRecord[id] = value;
          } else {
            index = keys.indexOf(key);
            if (index >= 0) {
              values[index] = value;
            } else {
              index = keys.length;
              values[index] = value;
              keys[index] = key;
            }
          }
          return this;
        }
        function delete___(key) {
          var hiddenRecord = getHiddenRecord(key);
          var index,
              lastIndex;
          if (hiddenRecord) {
            return id in hiddenRecord && delete hiddenRecord[id];
          } else {
            index = keys.indexOf(key);
            if (index < 0) {
              return false;
            }
            lastIndex = keys.length - 1;
            keys[index] = void 0;
            values[index] = values[lastIndex];
            keys[index] = keys[lastIndex];
            keys.length = lastIndex;
            values.length = lastIndex;
            return true;
          }
        }
        return Object.create(OurWeakMap.prototype, {
          get___: {value: constFunc(get___)},
          has___: {value: constFunc(has___)},
          set___: {value: constFunc(set___)},
          delete___: {value: constFunc(delete___)}
        });
      };
      OurWeakMap.prototype = Object.create(Object.prototype, {
        get: {
          value: function get(key, opt_default) {
            return this.get___(key, opt_default);
          },
          writable: true,
          configurable: true
        },
        has: {
          value: function has(key) {
            return this.has___(key);
          },
          writable: true,
          configurable: true
        },
        set: {
          value: function set(key, value) {
            return this.set___(key, value);
          },
          writable: true,
          configurable: true
        },
        'delete': {
          value: function remove(key) {
            return this.delete___(key);
          },
          writable: true,
          configurable: true
        }
      });
      if (typeof HostWeakMap === 'function') {
        (function() {
          if (doubleWeakMapCheckSilentFailure && typeof Proxy !== 'undefined') {
            Proxy = undefined;
          }
          function DoubleWeakMap() {
            if (!(this instanceof OurWeakMap)) {
              calledAsFunctionWarning();
            }
            var hmap = new HostWeakMap();
            var omap = undefined;
            var enableSwitching = false;
            function dget(key, opt_default) {
              if (omap) {
                return hmap.has(key) ? hmap.get(key) : omap.get___(key, opt_default);
              } else {
                return hmap.get(key, opt_default);
              }
            }
            function dhas(key) {
              return hmap.has(key) || (omap ? omap.has___(key) : false);
            }
            var dset;
            if (doubleWeakMapCheckSilentFailure) {
              dset = function(key, value) {
                hmap.set(key, value);
                if (!hmap.has(key)) {
                  if (!omap) {
                    omap = new OurWeakMap();
                  }
                  omap.set(key, value);
                }
                return this;
              };
            } else {
              dset = function(key, value) {
                if (enableSwitching) {
                  try {
                    hmap.set(key, value);
                  } catch (e) {
                    if (!omap) {
                      omap = new OurWeakMap();
                    }
                    omap.set___(key, value);
                  }
                } else {
                  hmap.set(key, value);
                }
                return this;
              };
            }
            function ddelete(key) {
              var result = !!hmap['delete'](key);
              if (omap) {
                return omap.delete___(key) || result;
              }
              return result;
            }
            return Object.create(OurWeakMap.prototype, {
              get___: {value: constFunc(dget)},
              has___: {value: constFunc(dhas)},
              set___: {value: constFunc(dset)},
              delete___: {value: constFunc(ddelete)},
              permitHostObjects___: {value: constFunc(function(token) {
                  if (token === weakMapPermitHostObjects) {
                    enableSwitching = true;
                  } else {
                    throw new Error('bogus call to permitHostObjects___');
                  }
                })}
            });
          }
          DoubleWeakMap.prototype = OurWeakMap.prototype;
          module.exports = DoubleWeakMap;
          Object.defineProperty(WeakMap.prototype, 'constructor', {
            value: WeakMap,
            enumerable: false,
            configurable: true,
            writable: true
          });
        })();
      } else {
        if (typeof Proxy !== 'undefined') {
          Proxy = undefined;
        }
        module.exports = OurWeakMap;
      }
    })();
  }]])("system/boot-entry.js");
})(require('process'));
