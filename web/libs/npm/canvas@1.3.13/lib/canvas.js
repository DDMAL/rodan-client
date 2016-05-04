/* */ 
(function(Buffer) {
  'use strict';
  var canvas = require('./bindings'),
      Canvas = canvas.Canvas,
      Image = canvas.Image,
      cairoVersion = canvas.cairoVersion,
      Context2d = require('./context2d'),
      PNGStream = require('./pngstream'),
      JPEGStream = require('./jpegstream'),
      FontFace = canvas.FontFace,
      fs = require('fs'),
      packageJson = require('../package.json!systemjs-json'),
      FORMATS = ['image/png', 'image/jpeg'];
  var Canvas = exports = module.exports = Canvas;
  exports.version = packageJson.version;
  exports.cairoVersion = cairoVersion;
  if (canvas.jpegVersion) {
    exports.jpegVersion = canvas.jpegVersion;
  }
  if (canvas.gifVersion) {
    exports.gifVersion = canvas.gifVersion.replace(/[^.\d]/g, '');
  }
  if (canvas.freetypeVersion) {
    exports.freetypeVersion = canvas.freetypeVersion;
  }
  exports.Context2d = Context2d;
  exports.PNGStream = PNGStream;
  exports.JPEGStream = JPEGStream;
  exports.Image = Image;
  exports.ImageData = canvas.ImageData;
  if (FontFace) {
    var Font = function Font(name, path, idx) {
      this.name = name;
      this._faces = {};
      this.addFace(path, 'normal', 'normal', idx);
    };
    Font.prototype.addFace = function(path, weight, style, idx) {
      style = style || 'normal';
      weight = weight || 'normal';
      var face = new FontFace(path, idx || 0);
      this._faces[weight + '-' + style] = face;
    };
    Font.prototype.getFace = function(weightStyle) {
      return this._faces[weightStyle] || this._faces['normal-normal'];
    };
    exports.Font = Font;
  }
  require('./context2d');
  require('./image');
  Canvas.prototype.inspect = function() {
    return '[Canvas ' + this.width + 'x' + this.height + ']';
  };
  Canvas.prototype.getContext = function(contextId) {
    if ('2d' == contextId) {
      var ctx = this._context2d || (this._context2d = new Context2d(this));
      this.context = ctx;
      ctx.canvas = this;
      return ctx;
    }
  };
  Canvas.prototype.pngStream = Canvas.prototype.createPNGStream = function() {
    return new PNGStream(this);
  };
  Canvas.prototype.syncPNGStream = Canvas.prototype.createSyncPNGStream = function() {
    return new PNGStream(this, true);
  };
  Canvas.prototype.jpegStream = Canvas.prototype.createJPEGStream = function(options) {
    return this.createSyncJPEGStream(options);
  };
  Canvas.prototype.syncJPEGStream = Canvas.prototype.createSyncJPEGStream = function(options) {
    options = options || {};
    return new JPEGStream(this, {
      bufsize: options.bufsize || 4096,
      quality: options.quality || 75,
      progressive: options.progressive || false
    });
  };
  Canvas.prototype.toDataURL = function(a1, a2, a3) {
    if (this.width === 0 || this.height === 0) {
      return "data:,";
    }
    var type = 'image/png';
    var opts = {};
    var fn;
    if ('function' === typeof a1) {
      fn = a1;
    } else {
      if ('string' === typeof a1 && FORMATS.indexOf(a1.toLowerCase()) !== -1) {
        type = a1.toLowerCase();
      }
      if ('function' === typeof a2) {
        fn = a2;
      } else {
        if ('object' === typeof a2) {
          opts = a2;
        } else if ('number' === typeof a2) {
          opts = {quality: Math.max(0, Math.min(1, a2)) * 100};
        }
        if ('function' === typeof a3) {
          fn = a3;
        } else if (undefined !== a3) {
          throw new TypeError(typeof a3 + ' is not a function');
        }
      }
    }
    if ('image/png' === type) {
      if (fn) {
        this.toBuffer(function(err, buf) {
          if (err)
            return fn(err);
          fn(null, 'data:image/png;base64,' + buf.toString('base64'));
        });
      } else {
        return 'data:image/png;base64,' + this.toBuffer().toString('base64');
      }
    } else if ('image/jpeg' === type) {
      if (undefined === fn) {
        throw new Error('Missing required callback function for format "image/jpeg"');
      }
      var stream = this.jpegStream(opts);
      var buffers = [];
      stream.on('data', function(chunk) {
        buffers.push(chunk);
      });
      stream.on('error', function(err) {
        fn(err);
      });
      stream.on('end', function() {
        var result = 'data:image/jpeg;base64,' + Buffer.concat(buffers).toString('base64');
        fn(null, result);
      });
    }
  };
})(require('buffer').Buffer);
