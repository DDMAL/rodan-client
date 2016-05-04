/* */ 
(function(process) {
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
})(require('process'));
