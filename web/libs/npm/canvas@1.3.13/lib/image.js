/* */ 
(function(Buffer) {
  'use strict';
  var Canvas = require('./bindings'),
      Image = Canvas.Image;
  Image.prototype.__defineSetter__('src', function(val) {
    if ('string' == typeof val && 0 == val.indexOf('data:')) {
      val = val.slice(val.indexOf(',') + 1);
      this.source = new Buffer(val, 'base64');
    } else {
      this.source = val;
    }
  });
  Image.prototype.__defineGetter__('src', function() {
    return this.source;
  });
  Image.prototype.inspect = function() {
    return '[Image' + (this.complete ? ':' + this.width + 'x' + this.height : '') + (this.src ? ' ' + this.src : '') + (this.complete ? ' complete' : '') + ']';
  };
})(require('buffer').Buffer);
