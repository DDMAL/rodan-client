/* */ 
'use strict';
var canvas = require('./bindings'),
    Context2d = canvas.CanvasRenderingContext2d,
    CanvasGradient = canvas.CanvasGradient,
    CanvasPattern = canvas.CanvasPattern,
    ImageData = canvas.ImageData;
var Context2d = exports = module.exports = Context2d;
var cache = {};
var baselines = ['alphabetic', 'top', 'bottom', 'middle', 'ideographic', 'hanging'];
var weights = 'normal|bold|bolder|lighter|[1-9]00',
    styles = 'normal|italic|oblique',
    units = 'px|pt|pc|in|cm|mm|%',
    string = '\'([^\']+)\'|"([^"]+)"|[\\w-]+';
var fontre = new RegExp('^ *' + '(?:(' + weights + ') *)?' + '(?:(' + styles + ') *)?' + '([\\d\\.]+)(' + units + ') *' + '((?:' + string + ')( *, *(?:' + string + '))*)');
var parseFont = exports.parseFont = function(str) {
  var font = {},
      captures = fontre.exec(str);
  if (!captures)
    return;
  if (cache[str])
    return cache[str];
  font.weight = captures[1] || 'normal';
  font.style = captures[2] || 'normal';
  font.size = parseFloat(captures[3]);
  font.unit = captures[4];
  font.family = captures[5].replace(/["']/g, '').split(',')[0].trim();
  switch (font.unit) {
    case 'pt':
      font.size /= .75;
      break;
    case 'in':
      font.size *= 96;
      break;
    case 'mm':
      font.size *= 96.0 / 25.4;
      break;
    case 'cm':
      font.size *= 96.0 / 2.54;
      break;
  }
  return cache[str] = font;
};
Context2d.prototype.__defineSetter__('imageSmoothingEnabled', function(val) {
  this._imageSmoothing = !!val;
  this.patternQuality = val ? 'best' : 'fast';
});
Context2d.prototype.__defineGetter__('imageSmoothingEnabled', function(val) {
  return !!this._imageSmoothing;
});
Context2d.prototype.createPattern = function(image, repetition) {
  return new CanvasPattern(image);
};
Context2d.prototype.createLinearGradient = function(x0, y0, x1, y1) {
  return new CanvasGradient(x0, y0, x1, y1);
};
Context2d.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
  return new CanvasGradient(x0, y0, r0, x1, y1, r1);
};
Context2d.prototype.setTransform = function() {
  this.resetTransform();
  this.transform.apply(this, arguments);
};
Context2d.prototype.__defineSetter__('fillStyle', function(val) {
  if (!val)
    return;
  if ('CanvasGradient' == val.constructor.name || 'CanvasPattern' == val.constructor.name) {
    this.lastFillStyle = val;
    this._setFillPattern(val);
  } else if ('string' == typeof val) {
    this._setFillColor(val);
  }
});
Context2d.prototype.__defineGetter__('fillStyle', function() {
  return this.lastFillStyle || this.fillColor;
});
Context2d.prototype.__defineSetter__('strokeStyle', function(val) {
  if (!val)
    return;
  if ('CanvasGradient' == val.constructor.name || 'CanvasPattern' == val.constructor.name) {
    this.lastStrokeStyle = val;
    this._setStrokePattern(val);
  } else if ('string' == typeof val) {
    this._setStrokeColor(val);
  }
});
Context2d.prototype.__defineGetter__('strokeStyle', function() {
  return this.lastStrokeStyle || this.strokeColor;
});
Context2d.prototype.addFont = function(font) {
  this._fonts = this._fonts || {};
  if (this._fonts[font.name])
    return;
  this._fonts[font.name] = font;
};
Context2d.prototype.__defineSetter__('font', function(val) {
  if (!val)
    return;
  if ('string' == typeof val) {
    var font;
    if (font = parseFont(val)) {
      this.lastFontString = val;
      var fonts = this._fonts;
      if (fonts && fonts[font.family]) {
        var fontObj = fonts[font.family];
        var type = font.weight + '-' + font.style;
        var fontFace = fontObj.getFace(type);
        this._setFontFace(fontFace, font.size);
      } else {
        this._setFont(font.weight, font.style, font.size, font.unit, font.family);
      }
    }
  }
});
Context2d.prototype.__defineGetter__('font', function() {
  return this.lastFontString || '10px sans-serif';
});
Context2d.prototype.__defineSetter__('textBaseline', function(val) {
  if (!val)
    return;
  var n = baselines.indexOf(val);
  if (~n) {
    this.lastBaseline = val;
    this._setTextBaseline(n);
  }
});
Context2d.prototype.__defineGetter__('textBaseline', function() {
  return this.lastBaseline || 'alphabetic';
});
Context2d.prototype.__defineSetter__('textAlign', function(val) {
  switch (val) {
    case 'center':
      this._setTextAlignment(0);
      this.lastTextAlignment = val;
      break;
    case 'left':
    case 'start':
      this._setTextAlignment(-1);
      this.lastTextAlignment = val;
      break;
    case 'right':
    case 'end':
      this._setTextAlignment(1);
      this.lastTextAlignment = val;
      break;
  }
});
Context2d.prototype.__defineGetter__('textAlign', function() {
  return this.lastTextAlignment || 'start';
});
Context2d.prototype.createImageData = function(width, height) {
  if ('ImageData' == width.constructor.name) {
    height = width.height;
    width = width.width;
  }
  return new ImageData(new Uint8ClampedArray(width * height * 4), width, height);
};
