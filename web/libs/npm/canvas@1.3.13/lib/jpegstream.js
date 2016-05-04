/* */ 
(function(Buffer, process) {
  'use strict';
  var Stream = require('stream').Stream;
  var JPEGStream = module.exports = function JPEGStream(canvas, options, sync) {
    var self = this,
        method = sync ? 'streamJPEGSync' : 'streamJPEG';
    this.options = options;
    this.sync = sync;
    this.canvas = canvas;
    this.readable = true;
    if ('streamJPEG' == method)
      method = 'streamJPEGSync';
    process.nextTick(function() {
      canvas[method](options.bufsize, options.quality, options.progressive, function(err, chunk) {
        if (err) {
          self.emit('error', err);
          self.readable = false;
        } else if (chunk) {
          self.emit('data', chunk);
        } else {
          self.emit('end');
          self.readable = false;
        }
      });
    });
  };
  JPEGStream.prototype.__proto__ = Stream.prototype;
})(require('buffer').Buffer, require('process'));
