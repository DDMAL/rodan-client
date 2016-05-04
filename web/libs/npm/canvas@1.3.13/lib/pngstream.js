/* */ 
(function(Buffer, process) {
  'use strict';
  var Stream = require('stream').Stream;
  var PNGStream = module.exports = function PNGStream(canvas, sync) {
    var self = this,
        method = sync ? 'streamPNGSync' : 'streamPNG';
    this.sync = sync;
    this.canvas = canvas;
    this.readable = true;
    if ('streamPNG' == method)
      method = 'streamPNGSync';
    process.nextTick(function() {
      canvas[method](function(err, chunk, len) {
        if (err) {
          self.emit('error', err);
          self.readable = false;
        } else if (len) {
          self.emit('data', chunk, len);
        } else {
          self.emit('end');
          self.readable = false;
        }
      });
    });
  };
  PNGStream.prototype.__proto__ = Stream.prototype;
})(require('buffer').Buffer, require('process'));
