/* */ 
"format cjs";
(function(process) {
  (function(factory) {
    var root = (typeof self == 'object' && self.self === self && self) || (typeof global == 'object' && global.global === global && global);
    if (typeof define === 'function' && define.amd) {
      define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
        root.Backbone = factory(root, exports, _, $);
      });
    } else if (typeof exports !== 'undefined') {
      var _ = require('underscore'),
          $;
      try {
        $ = require('jquery');
      } catch (e) {}
      factory(root, exports, _, $);
    } else {
      root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
    }
  })(function(root, Backbone, _, $) {
    var previousBackbone = root.Backbone;
    var slice = Array.prototype.slice;
    Backbone.VERSION = '1.3.3';
    Backbone.$ = $;
    Backbone.noConflict = function() {
      root.Backbone = previousBackbone;
      return this;
    };
    Backbone.emulateHTTP = false;
    Backbone.emulateJSON = false;
    var addMethod = function(length, method, attribute) {
      switch (length) {
        case 1:
          return function() {
            return _[method](this[attribute]);
          };
        case 2:
          return function(value) {
            return _[method](this[attribute], value);
          };
        case 3:
          return function(iteratee, context) {
            return _[method](this[attribute], cb(iteratee, this), context);
          };
        case 4:
          return function(iteratee, defaultVal, context) {
            return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
          };
        default:
          return function() {
            var args = slice.call(arguments);
            args.unshift(this[attribute]);
            return _[method].apply(_, args);
          };
      }
    };
    var addUnderscoreMethods = function(Class, methods, attribute) {
      _.each(methods, function(length, method) {
        if (_[method])
          Class.prototype[method] = addMethod(length, method, attribute);
      });
    };
    var cb = function(iteratee, instance) {
      if (_.isFunction(iteratee))
        return iteratee;
      if (_.isObject(iteratee) && !instance._isModel(iteratee))
        return modelMatcher(iteratee);
      if (_.isString(iteratee))
        return function(model) {
          return model.get(iteratee);
        };
      return iteratee;
    };
    var modelMatcher = function(attrs) {
      var matcher = _.matches(attrs);
      return function(model) {
        return matcher(model.attributes);
      };
    };
    var Events = Backbone.Events = {};
    var eventSplitter = /\s+/;
    var eventsApi = function(iteratee, events, name, callback, opts) {
      var i = 0,
          names;
      if (name && typeof name === 'object') {
        if (callback !== void 0 && 'context' in opts && opts.context === void 0)
          opts.context = callback;
        for (names = _.keys(name); i < names.length; i++) {
          events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
        }
      } else if (name && eventSplitter.test(name)) {
        for (names = name.split(eventSplitter); i < names.length; i++) {
          events = iteratee(events, names[i], callback, opts);
        }
      } else {
        events = iteratee(events, name, callback, opts);
      }
      return events;
    };
    Events.on = function(name, callback, context) {
      return internalOn(this, name, callback, context);
    };
    var internalOn = function(obj, name, callback, context, listening) {
      obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
        context: context,
        ctx: obj,
        listening: listening
      });
      if (listening) {
        var listeners = obj._listeners || (obj._listeners = {});
        listeners[listening.id] = listening;
      }
      return obj;
    };
    Events.listenTo = function(obj, name, callback) {
      if (!obj)
        return this;
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var listening = listeningTo[id];
      if (!listening) {
        var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
        listening = listeningTo[id] = {
          obj: obj,
          objId: id,
          id: thisId,
          listeningTo: listeningTo,
          count: 0
        };
      }
      internalOn(obj, name, callback, this, listening);
      return this;
    };
    var onApi = function(events, name, callback, options) {
      if (callback) {
        var handlers = events[name] || (events[name] = []);
        var context = options.context,
            ctx = options.ctx,
            listening = options.listening;
        if (listening)
          listening.count++;
        handlers.push({
          callback: callback,
          context: context,
          ctx: context || ctx,
          listening: listening
        });
      }
      return events;
    };
    Events.off = function(name, callback, context) {
      if (!this._events)
        return this;
      this._events = eventsApi(offApi, this._events, name, callback, {
        context: context,
        listeners: this._listeners
      });
      return this;
    };
    Events.stopListening = function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo)
        return this;
      var ids = obj ? [obj._listenId] : _.keys(listeningTo);
      for (var i = 0; i < ids.length; i++) {
        var listening = listeningTo[ids[i]];
        if (!listening)
          break;
        listening.obj.off(name, callback, this);
      }
      return this;
    };
    var offApi = function(events, name, callback, options) {
      if (!events)
        return;
      var i = 0,
          listening;
      var context = options.context,
          listeners = options.listeners;
      if (!name && !callback && !context) {
        var ids = _.keys(listeners);
        for (; i < ids.length; i++) {
          listening = listeners[ids[i]];
          delete listeners[listening.id];
          delete listening.listeningTo[listening.objId];
        }
        return;
      }
      var names = name ? [name] : _.keys(events);
      for (; i < names.length; i++) {
        name = names[i];
        var handlers = events[name];
        if (!handlers)
          break;
        var remaining = [];
        for (var j = 0; j < handlers.length; j++) {
          var handler = handlers[j];
          if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
            remaining.push(handler);
          } else {
            listening = handler.listening;
            if (listening && --listening.count === 0) {
              delete listeners[listening.id];
              delete listening.listeningTo[listening.objId];
            }
          }
        }
        if (remaining.length) {
          events[name] = remaining;
        } else {
          delete events[name];
        }
      }
      return events;
    };
    Events.once = function(name, callback, context) {
      var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
      if (typeof name === 'string' && context == null)
        callback = void 0;
      return this.on(events, callback, context);
    };
    Events.listenToOnce = function(obj, name, callback) {
      var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
      return this.listenTo(obj, events);
    };
    var onceMap = function(map, name, callback, offer) {
      if (callback) {
        var once = map[name] = _.once(function() {
          offer(name, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
      }
      return map;
    };
    Events.trigger = function(name) {
      if (!this._events)
        return this;
      var length = Math.max(0, arguments.length - 1);
      var args = Array(length);
      for (var i = 0; i < length; i++)
        args[i] = arguments[i + 1];
      eventsApi(triggerApi, this._events, name, void 0, args);
      return this;
    };
    var triggerApi = function(objEvents, name, callback, args) {
      if (objEvents) {
        var events = objEvents[name];
        var allEvents = objEvents.all;
        if (events && allEvents)
          allEvents = allEvents.slice();
        if (events)
          triggerEvents(events, args);
        if (allEvents)
          triggerEvents(allEvents, [name].concat(args));
      }
      return objEvents;
    };
    var triggerEvents = function(events, args) {
      var ev,
          i = -1,
          l = events.length,
          a1 = args[0],
          a2 = args[1],
          a3 = args[2];
      switch (args.length) {
        case 0:
          while (++i < l)
            (ev = events[i]).callback.call(ev.ctx);
          return;
        case 1:
          while (++i < l)
            (ev = events[i]).callback.call(ev.ctx, a1);
          return;
        case 2:
          while (++i < l)
            (ev = events[i]).callback.call(ev.ctx, a1, a2);
          return;
        case 3:
          while (++i < l)
            (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
          return;
        default:
          while (++i < l)
            (ev = events[i]).callback.apply(ev.ctx, args);
          return;
      }
    };
    Events.bind = Events.on;
    Events.unbind = Events.off;
    _.extend(Backbone, Events);
    var Model = Backbone.Model = function(attributes, options) {
      var attrs = attributes || {};
      options || (options = {});
      this.cid = _.uniqueId(this.cidPrefix);
      this.attributes = {};
      if (options.collection)
        this.collection = options.collection;
      if (options.parse)
        attrs = this.parse(attrs, options) || {};
      var defaults = _.result(this, 'defaults');
      attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
      this.set(attrs, options);
      this.changed = {};
      this.initialize.apply(this, arguments);
    };
    _.extend(Model.prototype, Events, {
      changed: null,
      validationError: null,
      idAttribute: 'id',
      cidPrefix: 'c',
      initialize: function() {},
      toJSON: function(options) {
        return _.clone(this.attributes);
      },
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
      get: function(attr) {
        return this.attributes[attr];
      },
      escape: function(attr) {
        return _.escape(this.get(attr));
      },
      has: function(attr) {
        return this.get(attr) != null;
      },
      matches: function(attrs) {
        return !!_.iteratee(attrs, this)(this.attributes);
      },
      set: function(key, val, options) {
        if (key == null)
          return this;
        var attrs;
        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
        options || (options = {});
        if (!this._validate(attrs, options))
          return false;
        var unset = options.unset;
        var silent = options.silent;
        var changes = [];
        var changing = this._changing;
        this._changing = true;
        if (!changing) {
          this._previousAttributes = _.clone(this.attributes);
          this.changed = {};
        }
        var current = this.attributes;
        var changed = this.changed;
        var prev = this._previousAttributes;
        for (var attr in attrs) {
          val = attrs[attr];
          if (!_.isEqual(current[attr], val))
            changes.push(attr);
          if (!_.isEqual(prev[attr], val)) {
            changed[attr] = val;
          } else {
            delete changed[attr];
          }
          unset ? delete current[attr] : current[attr] = val;
        }
        if (this.idAttribute in attrs)
          this.id = this.get(this.idAttribute);
        if (!silent) {
          if (changes.length)
            this._pending = options;
          for (var i = 0; i < changes.length; i++) {
            this.trigger('change:' + changes[i], this, current[changes[i]], options);
          }
        }
        if (changing)
          return this;
        if (!silent) {
          while (this._pending) {
            options = this._pending;
            this._pending = false;
            this.trigger('change', this, options);
          }
        }
        this._pending = false;
        this._changing = false;
        return this;
      },
      unset: function(attr, options) {
        return this.set(attr, void 0, _.extend({}, options, {unset: true}));
      },
      clear: function(options) {
        var attrs = {};
        for (var key in this.attributes)
          attrs[key] = void 0;
        return this.set(attrs, _.extend({}, options, {unset: true}));
      },
      hasChanged: function(attr) {
        if (attr == null)
          return !_.isEmpty(this.changed);
        return _.has(this.changed, attr);
      },
      changedAttributes: function(diff) {
        if (!diff)
          return this.hasChanged() ? _.clone(this.changed) : false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        var changed = {};
        for (var attr in diff) {
          var val = diff[attr];
          if (_.isEqual(old[attr], val))
            continue;
          changed[attr] = val;
        }
        return _.size(changed) ? changed : false;
      },
      previous: function(attr) {
        if (attr == null || !this._previousAttributes)
          return null;
        return this._previousAttributes[attr];
      },
      previousAttributes: function() {
        return _.clone(this._previousAttributes);
      },
      fetch: function(options) {
        options = _.extend({parse: true}, options);
        var model = this;
        var success = options.success;
        options.success = function(resp) {
          var serverAttrs = options.parse ? model.parse(resp, options) : resp;
          if (!model.set(serverAttrs, options))
            return false;
          if (success)
            success.call(options.context, model, resp, options);
          model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
        return this.sync('read', this, options);
      },
      save: function(key, val, options) {
        var attrs;
        if (key == null || typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
        options = _.extend({
          validate: true,
          parse: true
        }, options);
        var wait = options.wait;
        if (attrs && !wait) {
          if (!this.set(attrs, options))
            return false;
        } else if (!this._validate(attrs, options)) {
          return false;
        }
        var model = this;
        var success = options.success;
        var attributes = this.attributes;
        options.success = function(resp) {
          model.attributes = attributes;
          var serverAttrs = options.parse ? model.parse(resp, options) : resp;
          if (wait)
            serverAttrs = _.extend({}, attrs, serverAttrs);
          if (serverAttrs && !model.set(serverAttrs, options))
            return false;
          if (success)
            success.call(options.context, model, resp, options);
          model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
        if (attrs && wait)
          this.attributes = _.extend({}, attributes, attrs);
        var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
        if (method === 'patch' && !options.attrs)
          options.attrs = attrs;
        var xhr = this.sync(method, this, options);
        this.attributes = attributes;
        return xhr;
      },
      destroy: function(options) {
        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;
        var wait = options.wait;
        var destroy = function() {
          model.stopListening();
          model.trigger('destroy', model, model.collection, options);
        };
        options.success = function(resp) {
          if (wait)
            destroy();
          if (success)
            success.call(options.context, model, resp, options);
          if (!model.isNew())
            model.trigger('sync', model, resp, options);
        };
        var xhr = false;
        if (this.isNew()) {
          _.defer(options.success);
        } else {
          wrapError(this, options);
          xhr = this.sync('delete', this, options);
        }
        if (!wait)
          destroy();
        return xhr;
      },
      url: function() {
        var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
        if (this.isNew())
          return base;
        var id = this.get(this.idAttribute);
        return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
      },
      parse: function(resp, options) {
        return resp;
      },
      clone: function() {
        return new this.constructor(this.attributes);
      },
      isNew: function() {
        return !this.has(this.idAttribute);
      },
      isValid: function(options) {
        return this._validate({}, _.extend({}, options, {validate: true}));
      },
      _validate: function(attrs, options) {
        if (!options.validate || !this.validate)
          return true;
        attrs = _.extend({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error)
          return true;
        this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
        return false;
      }
    });
    var modelMethods = {
      keys: 1,
      values: 1,
      pairs: 1,
      invert: 1,
      pick: 0,
      omit: 0,
      chain: 1,
      isEmpty: 1
    };
    addUnderscoreMethods(Model, modelMethods, 'attributes');
    var Collection = Backbone.Collection = function(models, options) {
      options || (options = {});
      if (options.model)
        this.model = options.model;
      if (options.comparator !== void 0)
        this.comparator = options.comparator;
      this._reset();
      this.initialize.apply(this, arguments);
      if (models)
        this.reset(models, _.extend({silent: true}, options));
    };
    var setOptions = {
      add: true,
      remove: true,
      merge: true
    };
    var addOptions = {
      add: true,
      remove: false
    };
    var splice = function(array, insert, at) {
      at = Math.min(Math.max(at, 0), array.length);
      var tail = Array(array.length - at);
      var length = insert.length;
      var i;
      for (i = 0; i < tail.length; i++)
        tail[i] = array[i + at];
      for (i = 0; i < length; i++)
        array[i + at] = insert[i];
      for (i = 0; i < tail.length; i++)
        array[i + length + at] = tail[i];
    };
    _.extend(Collection.prototype, Events, {
      model: Model,
      initialize: function() {},
      toJSON: function(options) {
        return this.map(function(model) {
          return model.toJSON(options);
        });
      },
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
      add: function(models, options) {
        return this.set(models, _.extend({merge: false}, options, addOptions));
      },
      remove: function(models, options) {
        options = _.extend({}, options);
        var singular = !_.isArray(models);
        models = singular ? [models] : models.slice();
        var removed = this._removeModels(models, options);
        if (!options.silent && removed.length) {
          options.changes = {
            added: [],
            merged: [],
            removed: removed
          };
          this.trigger('update', this, options);
        }
        return singular ? removed[0] : removed;
      },
      set: function(models, options) {
        if (models == null)
          return;
        options = _.extend({}, setOptions, options);
        if (options.parse && !this._isModel(models)) {
          models = this.parse(models, options) || [];
        }
        var singular = !_.isArray(models);
        models = singular ? [models] : models.slice();
        var at = options.at;
        if (at != null)
          at = +at;
        if (at > this.length)
          at = this.length;
        if (at < 0)
          at += this.length + 1;
        var set = [];
        var toAdd = [];
        var toMerge = [];
        var toRemove = [];
        var modelMap = {};
        var add = options.add;
        var merge = options.merge;
        var remove = options.remove;
        var sort = false;
        var sortable = this.comparator && at == null && options.sort !== false;
        var sortAttr = _.isString(this.comparator) ? this.comparator : null;
        var model,
            i;
        for (i = 0; i < models.length; i++) {
          model = models[i];
          var existing = this.get(model);
          if (existing) {
            if (merge && model !== existing) {
              var attrs = this._isModel(model) ? model.attributes : model;
              if (options.parse)
                attrs = existing.parse(attrs, options);
              existing.set(attrs, options);
              toMerge.push(existing);
              if (sortable && !sort)
                sort = existing.hasChanged(sortAttr);
            }
            if (!modelMap[existing.cid]) {
              modelMap[existing.cid] = true;
              set.push(existing);
            }
            models[i] = existing;
          } else if (add) {
            model = models[i] = this._prepareModel(model, options);
            if (model) {
              toAdd.push(model);
              this._addReference(model, options);
              modelMap[model.cid] = true;
              set.push(model);
            }
          }
        }
        if (remove) {
          for (i = 0; i < this.length; i++) {
            model = this.models[i];
            if (!modelMap[model.cid])
              toRemove.push(model);
          }
          if (toRemove.length)
            this._removeModels(toRemove, options);
        }
        var orderChanged = false;
        var replace = !sortable && add && remove;
        if (set.length && replace) {
          orderChanged = this.length !== set.length || _.some(this.models, function(m, index) {
            return m !== set[index];
          });
          this.models.length = 0;
          splice(this.models, set, 0);
          this.length = this.models.length;
        } else if (toAdd.length) {
          if (sortable)
            sort = true;
          splice(this.models, toAdd, at == null ? this.length : at);
          this.length = this.models.length;
        }
        if (sort)
          this.sort({silent: true});
        if (!options.silent) {
          for (i = 0; i < toAdd.length; i++) {
            if (at != null)
              options.index = at + i;
            model = toAdd[i];
            model.trigger('add', model, this, options);
          }
          if (sort || orderChanged)
            this.trigger('sort', this, options);
          if (toAdd.length || toRemove.length || toMerge.length) {
            options.changes = {
              added: toAdd,
              removed: toRemove,
              merged: toMerge
            };
            this.trigger('update', this, options);
          }
        }
        return singular ? models[0] : models;
      },
      reset: function(models, options) {
        options = options ? _.clone(options) : {};
        for (var i = 0; i < this.models.length; i++) {
          this._removeReference(this.models[i], options);
        }
        options.previousModels = this.models;
        this._reset();
        models = this.add(models, _.extend({silent: true}, options));
        if (!options.silent)
          this.trigger('reset', this, options);
        return models;
      },
      push: function(model, options) {
        return this.add(model, _.extend({at: this.length}, options));
      },
      pop: function(options) {
        var model = this.at(this.length - 1);
        return this.remove(model, options);
      },
      unshift: function(model, options) {
        return this.add(model, _.extend({at: 0}, options));
      },
      shift: function(options) {
        var model = this.at(0);
        return this.remove(model, options);
      },
      slice: function() {
        return slice.apply(this.models, arguments);
      },
      get: function(obj) {
        if (obj == null)
          return void 0;
        return this._byId[obj] || this._byId[this.modelId(obj.attributes || obj)] || obj.cid && this._byId[obj.cid];
      },
      has: function(obj) {
        return this.get(obj) != null;
      },
      at: function(index) {
        if (index < 0)
          index += this.length;
        return this.models[index];
      },
      where: function(attrs, first) {
        return this[first ? 'find' : 'filter'](attrs);
      },
      findWhere: function(attrs) {
        return this.where(attrs, true);
      },
      sort: function(options) {
        var comparator = this.comparator;
        if (!comparator)
          throw new Error('Cannot sort a set without a comparator');
        options || (options = {});
        var length = comparator.length;
        if (_.isFunction(comparator))
          comparator = _.bind(comparator, this);
        if (length === 1 || _.isString(comparator)) {
          this.models = this.sortBy(comparator);
        } else {
          this.models.sort(comparator);
        }
        if (!options.silent)
          this.trigger('sort', this, options);
        return this;
      },
      pluck: function(attr) {
        return this.map(attr + '');
      },
      fetch: function(options) {
        options = _.extend({parse: true}, options);
        var success = options.success;
        var collection = this;
        options.success = function(resp) {
          var method = options.reset ? 'reset' : 'set';
          collection[method](resp, options);
          if (success)
            success.call(options.context, collection, resp, options);
          collection.trigger('sync', collection, resp, options);
        };
        wrapError(this, options);
        return this.sync('read', this, options);
      },
      create: function(model, options) {
        options = options ? _.clone(options) : {};
        var wait = options.wait;
        model = this._prepareModel(model, options);
        if (!model)
          return false;
        if (!wait)
          this.add(model, options);
        var collection = this;
        var success = options.success;
        options.success = function(m, resp, callbackOpts) {
          if (wait)
            collection.add(m, callbackOpts);
          if (success)
            success.call(callbackOpts.context, m, resp, callbackOpts);
        };
        model.save(null, options);
        return model;
      },
      parse: function(resp, options) {
        return resp;
      },
      clone: function() {
        return new this.constructor(this.models, {
          model: this.model,
          comparator: this.comparator
        });
      },
      modelId: function(attrs) {
        return attrs[this.model.prototype.idAttribute || 'id'];
      },
      _reset: function() {
        this.length = 0;
        this.models = [];
        this._byId = {};
      },
      _prepareModel: function(attrs, options) {
        if (this._isModel(attrs)) {
          if (!attrs.collection)
            attrs.collection = this;
          return attrs;
        }
        options = options ? _.clone(options) : {};
        options.collection = this;
        var model = new this.model(attrs, options);
        if (!model.validationError)
          return model;
        this.trigger('invalid', this, model.validationError, options);
        return false;
      },
      _removeModels: function(models, options) {
        var removed = [];
        for (var i = 0; i < models.length; i++) {
          var model = this.get(models[i]);
          if (!model)
            continue;
          var index = this.indexOf(model);
          this.models.splice(index, 1);
          this.length--;
          delete this._byId[model.cid];
          var id = this.modelId(model.attributes);
          if (id != null)
            delete this._byId[id];
          if (!options.silent) {
            options.index = index;
            model.trigger('remove', model, this, options);
          }
          removed.push(model);
          this._removeReference(model, options);
        }
        return removed;
      },
      _isModel: function(model) {
        return model instanceof Model;
      },
      _addReference: function(model, options) {
        this._byId[model.cid] = model;
        var id = this.modelId(model.attributes);
        if (id != null)
          this._byId[id] = model;
        model.on('all', this._onModelEvent, this);
      },
      _removeReference: function(model, options) {
        delete this._byId[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null)
          delete this._byId[id];
        if (this === model.collection)
          delete model.collection;
        model.off('all', this._onModelEvent, this);
      },
      _onModelEvent: function(event, model, collection, options) {
        if (model) {
          if ((event === 'add' || event === 'remove') && collection !== this)
            return;
          if (event === 'destroy')
            this.remove(model, options);
          if (event === 'change') {
            var prevId = this.modelId(model.previousAttributes());
            var id = this.modelId(model.attributes);
            if (prevId !== id) {
              if (prevId != null)
                delete this._byId[prevId];
              if (id != null)
                this._byId[id] = model;
            }
          }
        }
        this.trigger.apply(this, arguments);
      }
    });
    var collectionMethods = {
      forEach: 3,
      each: 3,
      map: 3,
      collect: 3,
      reduce: 0,
      foldl: 0,
      inject: 0,
      reduceRight: 0,
      foldr: 0,
      find: 3,
      detect: 3,
      filter: 3,
      select: 3,
      reject: 3,
      every: 3,
      all: 3,
      some: 3,
      any: 3,
      include: 3,
      includes: 3,
      contains: 3,
      invoke: 0,
      max: 3,
      min: 3,
      toArray: 1,
      size: 1,
      first: 3,
      head: 3,
      take: 3,
      initial: 3,
      rest: 3,
      tail: 3,
      drop: 3,
      last: 3,
      without: 0,
      difference: 0,
      indexOf: 3,
      shuffle: 1,
      lastIndexOf: 3,
      isEmpty: 1,
      chain: 1,
      sample: 3,
      partition: 3,
      groupBy: 3,
      countBy: 3,
      sortBy: 3,
      indexBy: 3,
      findIndex: 3,
      findLastIndex: 3
    };
    addUnderscoreMethods(Collection, collectionMethods, 'models');
    var View = Backbone.View = function(options) {
      this.cid = _.uniqueId('view');
      _.extend(this, _.pick(options, viewOptions));
      this._ensureElement();
      this.initialize.apply(this, arguments);
    };
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
    _.extend(View.prototype, Events, {
      tagName: 'div',
      $: function(selector) {
        return this.$el.find(selector);
      },
      initialize: function() {},
      render: function() {
        return this;
      },
      remove: function() {
        this._removeElement();
        this.stopListening();
        return this;
      },
      _removeElement: function() {
        this.$el.remove();
      },
      setElement: function(element) {
        this.undelegateEvents();
        this._setElement(element);
        this.delegateEvents();
        return this;
      },
      _setElement: function(el) {
        this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
        this.el = this.$el[0];
      },
      delegateEvents: function(events) {
        events || (events = _.result(this, 'events'));
        if (!events)
          return this;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method))
            method = this[method];
          if (!method)
            continue;
          var match = key.match(delegateEventSplitter);
          this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
      },
      delegate: function(eventName, selector, listener) {
        this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
      },
      undelegateEvents: function() {
        if (this.$el)
          this.$el.off('.delegateEvents' + this.cid);
        return this;
      },
      undelegate: function(eventName, selector, listener) {
        this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
        return this;
      },
      _createElement: function(tagName) {
        return document.createElement(tagName);
      },
      _ensureElement: function() {
        if (!this.el) {
          var attrs = _.extend({}, _.result(this, 'attributes'));
          if (this.id)
            attrs.id = _.result(this, 'id');
          if (this.className)
            attrs['class'] = _.result(this, 'className');
          this.setElement(this._createElement(_.result(this, 'tagName')));
          this._setAttributes(attrs);
        } else {
          this.setElement(_.result(this, 'el'));
        }
      },
      _setAttributes: function(attributes) {
        this.$el.attr(attributes);
      }
    });
    Backbone.sync = function(method, model, options) {
      var type = methodMap[method];
      _.defaults(options || (options = {}), {
        emulateHTTP: Backbone.emulateHTTP,
        emulateJSON: Backbone.emulateJSON
      });
      var params = {
        type: type,
        dataType: 'json'
      };
      if (!options.url) {
        params.url = _.result(model, 'url') || urlError();
      }
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(options.attrs || model.toJSON(options));
      }
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
      }
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON)
          params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
          if (beforeSend)
            return beforeSend.apply(this, arguments);
        };
      }
      if (params.type !== 'GET' && !options.emulateJSON) {
        params.processData = false;
      }
      var error = options.error;
      options.error = function(xhr, textStatus, errorThrown) {
        options.textStatus = textStatus;
        options.errorThrown = errorThrown;
        if (error)
          error.call(options.context, xhr, textStatus, errorThrown);
      };
      var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      model.trigger('request', model, xhr, options);
      return xhr;
    };
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch': 'PATCH',
      'delete': 'DELETE',
      'read': 'GET'
    };
    Backbone.ajax = function() {
      return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
    var Router = Backbone.Router = function(options) {
      options || (options = {});
      if (options.routes)
        this.routes = options.routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    };
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    _.extend(Router.prototype, Events, {
      initialize: function() {},
      route: function(route, name, callback) {
        if (!_.isRegExp(route))
          route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
          callback = name;
          name = '';
        }
        if (!callback)
          callback = this[name];
        var router = this;
        Backbone.history.route(route, function(fragment) {
          var args = router._extractParameters(route, fragment);
          if (router.execute(callback, args, name) !== false) {
            router.trigger.apply(router, ['route:' + name].concat(args));
            router.trigger('route', name, args);
            Backbone.history.trigger('route', router, name, args);
          }
        });
        return this;
      },
      execute: function(callback, args, name) {
        if (callback)
          callback.apply(this, args);
      },
      navigate: function(fragment, options) {
        Backbone.history.navigate(fragment, options);
        return this;
      },
      _bindRoutes: function() {
        if (!this.routes)
          return;
        this.routes = _.result(this, 'routes');
        var route,
            routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
          this.route(route, this.routes[route]);
        }
      },
      _routeToRegExp: function(route) {
        route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function(match, optional) {
          return optional ? match : '([^/?]+)';
        }).replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
      },
      _extractParameters: function(route, fragment) {
        var params = route.exec(fragment).slice(1);
        return _.map(params, function(param, i) {
          if (i === params.length - 1)
            return param || null;
          return param ? decodeURIComponent(param) : null;
        });
      }
    });
    var History = Backbone.History = function() {
      this.handlers = [];
      this.checkUrl = _.bind(this.checkUrl, this);
      if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
      }
    };
    var routeStripper = /^[#\/]|\s+$/g;
    var rootStripper = /^\/+|\/+$/g;
    var pathStripper = /#.*$/;
    History.started = false;
    _.extend(History.prototype, Events, {
      interval: 50,
      atRoot: function() {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch();
      },
      matchRoot: function() {
        var path = this.decodeFragment(this.location.pathname);
        var rootPath = path.slice(0, this.root.length - 1) + '/';
        return rootPath === this.root;
      },
      decodeFragment: function(fragment) {
        return decodeURI(fragment.replace(/%25/g, '%2525'));
      },
      getSearch: function() {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
      },
      getHash: function(window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
      },
      getPath: function() {
        var path = this.decodeFragment(this.location.pathname + this.getSearch()).slice(this.root.length - 1);
        return path.charAt(0) === '/' ? path.slice(1) : path;
      },
      getFragment: function(fragment) {
        if (fragment == null) {
          if (this._usePushState || !this._wantsHashChange) {
            fragment = this.getPath();
          } else {
            fragment = this.getHash();
          }
        }
        return fragment.replace(routeStripper, '');
      },
      start: function(options) {
        if (History.started)
          throw new Error('Backbone.history has already been started');
        History.started = true;
        this.options = _.extend({root: '/'}, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange = 'onhashchange' in window && (document.documentMode === void 0 || document.documentMode > 7);
        this._useHashChange = this._wantsHashChange && this._hasHashChange;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.history && this.history.pushState);
        this._usePushState = this._wantsPushState && this._hasPushState;
        this.fragment = this.getFragment();
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');
        if (this._wantsHashChange && this._wantsPushState) {
          if (!this._hasPushState && !this.atRoot()) {
            var rootPath = this.root.slice(0, -1) || '/';
            this.location.replace(rootPath + '#' + this.getPath());
            return true;
          } else if (this._hasPushState && this.atRoot()) {
            this.navigate(this.getHash(), {replace: true});
          }
        }
        if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
          this.iframe = document.createElement('iframe');
          this.iframe.src = 'javascript:0';
          this.iframe.style.display = 'none';
          this.iframe.tabIndex = -1;
          var body = document.body;
          var iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
          iWindow.document.open();
          iWindow.document.close();
          iWindow.location.hash = '#' + this.fragment;
        }
        var addEventListener = window.addEventListener || function(eventName, listener) {
          return attachEvent('on' + eventName, listener);
        };
        if (this._usePushState) {
          addEventListener('popstate', this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          addEventListener('hashchange', this.checkUrl, false);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
        if (!this.options.silent)
          return this.loadUrl();
      },
      stop: function() {
        var removeEventListener = window.removeEventListener || function(eventName, listener) {
          return detachEvent('on' + eventName, listener);
        };
        if (this._usePushState) {
          removeEventListener('popstate', this.checkUrl, false);
        } else if (this._useHashChange && !this.iframe) {
          removeEventListener('hashchange', this.checkUrl, false);
        }
        if (this.iframe) {
          document.body.removeChild(this.iframe);
          this.iframe = null;
        }
        if (this._checkUrlInterval)
          clearInterval(this._checkUrlInterval);
        History.started = false;
      },
      route: function(route, callback) {
        this.handlers.unshift({
          route: route,
          callback: callback
        });
      },
      checkUrl: function(e) {
        var current = this.getFragment();
        if (current === this.fragment && this.iframe) {
          current = this.getHash(this.iframe.contentWindow);
        }
        if (current === this.fragment)
          return false;
        if (this.iframe)
          this.navigate(current);
        this.loadUrl();
      },
      loadUrl: function(fragment) {
        if (!this.matchRoot())
          return false;
        fragment = this.fragment = this.getFragment(fragment);
        return _.some(this.handlers, function(handler) {
          if (handler.route.test(fragment)) {
            handler.callback(fragment);
            return true;
          }
        });
      },
      navigate: function(fragment, options) {
        if (!History.started)
          return false;
        if (!options || options === true)
          options = {trigger: !!options};
        fragment = this.getFragment(fragment || '');
        var rootPath = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
          rootPath = rootPath.slice(0, -1) || '/';
        }
        var url = rootPath + fragment;
        fragment = this.decodeFragment(fragment.replace(pathStripper, ''));
        if (this.fragment === fragment)
          return;
        this.fragment = fragment;
        if (this._usePushState) {
          this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
        } else if (this._wantsHashChange) {
          this._updateHash(this.location, fragment, options.replace);
          if (this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
            var iWindow = this.iframe.contentWindow;
            if (!options.replace) {
              iWindow.document.open();
              iWindow.document.close();
            }
            this._updateHash(iWindow.location, fragment, options.replace);
          }
        } else {
          return this.location.assign(url);
        }
        if (options.trigger)
          return this.loadUrl(fragment);
      },
      _updateHash: function(location, fragment, replace) {
        if (replace) {
          var href = location.href.replace(/(javascript:|#).*$/, '');
          location.replace(href + '#' + fragment);
        } else {
          location.hash = '#' + fragment;
        }
      }
    });
    Backbone.history = new History;
    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function() {
          return parent.apply(this, arguments);
        };
      }
      _.extend(child, parent, staticProps);
      child.prototype = _.create(parent.prototype, protoProps);
      child.prototype.constructor = child;
      child.__super__ = parent.prototype;
      return child;
    };
    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
    var wrapError = function(model, options) {
      var error = options.error;
      options.error = function(resp) {
        if (error)
          error.call(options.context, model, resp, options);
        model.trigger('error', model, resp, options);
      };
    };
    return Backbone;
  });
})(require('process'));
