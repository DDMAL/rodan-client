/* */ 
(function(process) {
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
})(require('process'));
