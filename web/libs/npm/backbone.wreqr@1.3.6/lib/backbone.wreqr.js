/* */ 
"format cjs";
(function(process) {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['backbone', 'underscore'], function(Backbone, _) {
        return factory(Backbone, _);
      });
    } else if (typeof exports !== 'undefined') {
      var Backbone = require('backbone');
      var _ = require('underscore');
      module.exports = factory(Backbone, _);
    } else {
      factory(root.Backbone, root._);
    }
  }(this, function(Backbone, _) {
    "use strict";
    var previousWreqr = Backbone.Wreqr;
    var Wreqr = Backbone.Wreqr = {};
    Backbone.Wreqr.VERSION = '1.3.6';
    Backbone.Wreqr.noConflict = function() {
      Backbone.Wreqr = previousWreqr;
      return this;
    };
    Wreqr.Handlers = (function(Backbone, _) {
      "use strict";
      var Handlers = function(options) {
        this.options = options;
        this._wreqrHandlers = {};
        if (_.isFunction(this.initialize)) {
          this.initialize(options);
        }
      };
      Handlers.extend = Backbone.Model.extend;
      _.extend(Handlers.prototype, Backbone.Events, {
        setHandlers: function(handlers) {
          _.each(handlers, function(handler, name) {
            var context = null;
            if (_.isObject(handler) && !_.isFunction(handler)) {
              context = handler.context;
              handler = handler.callback;
            }
            this.setHandler(name, handler, context);
          }, this);
        },
        setHandler: function(name, handler, context) {
          var config = {
            callback: handler,
            context: context
          };
          this._wreqrHandlers[name] = config;
          this.trigger("handler:add", name, handler, context);
        },
        hasHandler: function(name) {
          return !!this._wreqrHandlers[name];
        },
        getHandler: function(name) {
          var config = this._wreqrHandlers[name];
          if (!config) {
            return;
          }
          return function() {
            return config.callback.apply(config.context, arguments);
          };
        },
        removeHandler: function(name) {
          delete this._wreqrHandlers[name];
        },
        removeAllHandlers: function() {
          this._wreqrHandlers = {};
        }
      });
      return Handlers;
    })(Backbone, _);
    Wreqr.CommandStorage = (function() {
      "use strict";
      var CommandStorage = function(options) {
        this.options = options;
        this._commands = {};
        if (_.isFunction(this.initialize)) {
          this.initialize(options);
        }
      };
      _.extend(CommandStorage.prototype, Backbone.Events, {
        getCommands: function(commandName) {
          var commands = this._commands[commandName];
          if (!commands) {
            commands = {
              command: commandName,
              instances: []
            };
            this._commands[commandName] = commands;
          }
          return commands;
        },
        addCommand: function(commandName, args) {
          var command = this.getCommands(commandName);
          command.instances.push(args);
        },
        clearCommands: function(commandName) {
          var command = this.getCommands(commandName);
          command.instances = [];
        }
      });
      return CommandStorage;
    })();
    Wreqr.Commands = (function(Wreqr, _) {
      "use strict";
      return Wreqr.Handlers.extend({
        storageType: Wreqr.CommandStorage,
        constructor: function(options) {
          this.options = options || {};
          this._initializeStorage(this.options);
          this.on("handler:add", this._executeCommands, this);
          Wreqr.Handlers.prototype.constructor.apply(this, arguments);
        },
        execute: function(name) {
          name = arguments[0];
          var args = _.rest(arguments);
          if (this.hasHandler(name)) {
            this.getHandler(name).apply(this, args);
          } else {
            this.storage.addCommand(name, args);
          }
        },
        _executeCommands: function(name, handler, context) {
          var command = this.storage.getCommands(name);
          _.each(command.instances, function(args) {
            handler.apply(context, args);
          });
          this.storage.clearCommands(name);
        },
        _initializeStorage: function(options) {
          var storage;
          var StorageType = options.storageType || this.storageType;
          if (_.isFunction(StorageType)) {
            storage = new StorageType();
          } else {
            storage = StorageType;
          }
          this.storage = storage;
        }
      });
    })(Wreqr, _);
    Wreqr.RequestResponse = (function(Wreqr, _) {
      "use strict";
      return Wreqr.Handlers.extend({request: function(name) {
          if (this.hasHandler(name)) {
            return this.getHandler(name).apply(this, _.rest(arguments));
          }
        }});
    })(Wreqr, _);
    Wreqr.EventAggregator = (function(Backbone, _) {
      "use strict";
      var EA = function() {};
      EA.extend = Backbone.Model.extend;
      _.extend(EA.prototype, Backbone.Events);
      return EA;
    })(Backbone, _);
    Wreqr.Channel = (function(Wreqr) {
      "use strict";
      var Channel = function(channelName) {
        this.vent = new Backbone.Wreqr.EventAggregator();
        this.reqres = new Backbone.Wreqr.RequestResponse();
        this.commands = new Backbone.Wreqr.Commands();
        this.channelName = channelName;
      };
      _.extend(Channel.prototype, {
        reset: function() {
          this.vent.off();
          this.vent.stopListening();
          this.reqres.removeAllHandlers();
          this.commands.removeAllHandlers();
          return this;
        },
        connectEvents: function(hash, context) {
          this._connect('vent', hash, context);
          return this;
        },
        connectCommands: function(hash, context) {
          this._connect('commands', hash, context);
          return this;
        },
        connectRequests: function(hash, context) {
          this._connect('reqres', hash, context);
          return this;
        },
        _connect: function(type, hash, context) {
          if (!hash) {
            return;
          }
          context = context || this;
          var method = (type === 'vent') ? 'on' : 'setHandler';
          _.each(hash, function(fn, eventName) {
            this[type][method](eventName, _.bind(fn, context));
          }, this);
        }
      });
      return Channel;
    })(Wreqr);
    Wreqr.radio = (function(Wreqr, _) {
      "use strict";
      var Radio = function() {
        this._channels = {};
        this.vent = {};
        this.commands = {};
        this.reqres = {};
        this._proxyMethods();
      };
      _.extend(Radio.prototype, {
        channel: function(channelName) {
          if (!channelName) {
            throw new Error('Channel must receive a name');
          }
          return this._getChannel(channelName);
        },
        _getChannel: function(channelName) {
          var channel = this._channels[channelName];
          if (!channel) {
            channel = new Wreqr.Channel(channelName);
            this._channels[channelName] = channel;
          }
          return channel;
        },
        _proxyMethods: function() {
          _.each(['vent', 'commands', 'reqres'], function(system) {
            _.each(messageSystems[system], function(method) {
              this[system][method] = proxyMethod(this, system, method);
            }, this);
          }, this);
        }
      });
      var messageSystems = {
        vent: ['on', 'off', 'trigger', 'once', 'stopListening', 'listenTo', 'listenToOnce'],
        commands: ['execute', 'setHandler', 'setHandlers', 'removeHandler', 'removeAllHandlers'],
        reqres: ['request', 'setHandler', 'setHandlers', 'removeHandler', 'removeAllHandlers']
      };
      var proxyMethod = function(radio, system, method) {
        return function(channelName) {
          var messageSystem = radio._getChannel(channelName)[system];
          return messageSystem[method].apply(messageSystem, _.rest(arguments));
        };
      };
      return new Radio();
    })(Wreqr, _);
    return Backbone.Wreqr;
  }));
})(require('process'));
