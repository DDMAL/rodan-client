/* */ 
(function(Buffer, process) {
  var CombinedStream = require('combined-stream');
  var util = require('util');
  var path = require('path');
  var http = require('http');
  var https = require('https');
  var parseUrl = require('url').parse;
  var fs = require('fs');
  var mime = require('mime-types');
  var async = require('async');
  var populate = require('./populate');
  module.exports = FormData;
  util.inherits(FormData, CombinedStream);
  function FormData() {
    if (!(this instanceof FormData)) {
      throw new TypeError('Failed to construct FormData: Please use the _new_ operator, this object constructor cannot be called as a function.');
    }
    this._overheadLength = 0;
    this._valueLength = 0;
    this._lengthRetrievers = [];
    CombinedStream.call(this);
  }
  FormData.LINE_BREAK = '\r\n';
  FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';
  FormData.prototype.append = function(field, value, options) {
    options = options || {};
    if (typeof options == 'string') {
      options = {filename: options};
    }
    var append = CombinedStream.prototype.append.bind(this);
    if (typeof value == 'number') {
      value = '' + value;
    }
    if (util.isArray(value)) {
      this._error(new Error('Arrays are not supported.'));
      return;
    }
    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();
    append(header);
    append(value);
    append(footer);
    this._trackLength(header, value, options);
  };
  FormData.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    if (options.knownLength != null) {
      valueLength += +options.knownLength;
    } else if (Buffer.isBuffer(value)) {
      valueLength = value.length;
    } else if (typeof value === 'string') {
      valueLength = Buffer.byteLength(value);
    }
    this._valueLength += valueLength;
    this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
    if (!value || (!value.path && !(value.readable && value.hasOwnProperty('httpVersion')))) {
      return;
    }
    if (!options.knownLength) {
      this._lengthRetrievers.push(function(next) {
        if (value.hasOwnProperty('fd')) {
          if (value.end != undefined && value.end != Infinity && value.start != undefined) {
            next(null, value.end + 1 - (value.start ? value.start : 0));
          } else {
            fs.stat(value.path, function(err, stat) {
              var fileSize;
              if (err) {
                next(err);
                return;
              }
              fileSize = stat.size - (value.start ? value.start : 0);
              next(null, fileSize);
            });
          }
        } else if (value.hasOwnProperty('httpVersion')) {
          next(null, +value.headers['content-length']);
        } else if (value.hasOwnProperty('httpModule')) {
          value.on('response', function(response) {
            value.pause();
            next(null, +response.headers['content-length']);
          });
          value.resume();
        } else {
          next('Unknown stream');
        }
      });
    }
  };
  FormData.prototype._multiPartHeader = function(field, value, options) {
    if (options.header) {
      return options.header;
    }
    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);
    var contents = '';
    var headers = {
      'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
      'Content-Type': [].concat(contentType || [])
    };
    for (var prop in headers) {
      if (headers[prop].length) {
        contents += prop + ': ' + headers[prop].join('; ') + FormData.LINE_BREAK;
      }
    }
    return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
  };
  FormData.prototype._getContentDisposition = function(value, options) {
    var contentDisposition;
    var filename = options.filename || value.path;
    if (!filename && value.readable && value.hasOwnProperty('httpVersion')) {
      filename = value.client._httpMessage.path;
    }
    if (filename) {
      contentDisposition = 'filename="' + path.basename(filename) + '"';
    }
    return contentDisposition;
  };
  FormData.prototype._getContentType = function(value, options) {
    var contentType = options.contentType;
    if (!contentType && value.path) {
      contentType = mime.lookup(value.path);
    }
    if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
      contentType = value.headers['content-type'];
    }
    if (!contentType && options.filename) {
      contentType = mime.lookup(options.filename);
    }
    if (!contentType && typeof value == 'object') {
      contentType = FormData.DEFAULT_CONTENT_TYPE;
    }
    return contentType;
  };
  FormData.prototype._multiPartFooter = function() {
    return function(next) {
      var footer = FormData.LINE_BREAK;
      var lastPart = (this._streams.length === 0);
      if (lastPart) {
        footer += this._lastBoundary();
      }
      next(footer);
    }.bind(this);
  };
  FormData.prototype._lastBoundary = function() {
    return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
  };
  FormData.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {'content-type': 'multipart/form-data; boundary=' + this.getBoundary()};
    for (header in userHeaders) {
      if (userHeaders.hasOwnProperty(header)) {
        formHeaders[header.toLowerCase()] = userHeaders[header];
      }
    }
    return formHeaders;
  };
  FormData.prototype.getCustomHeaders = function(contentType) {
    contentType = contentType ? contentType : 'multipart/form-data';
    var formHeaders = {
      'content-type': contentType + '; boundary=' + this.getBoundary(),
      'content-length': this.getLengthSync()
    };
    return formHeaders;
  };
  FormData.prototype.getBoundary = function() {
    if (!this._boundary) {
      this._generateBoundary();
    }
    return this._boundary;
  };
  FormData.prototype._generateBoundary = function() {
    var boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }
    this._boundary = boundary;
  };
  FormData.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }
    if (this._lengthRetrievers.length) {
      this._error(new Error('Cannot calculate proper length in synchronous way.'));
    }
    return knownLength;
  };
  FormData.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }
    if (!this._lengthRetrievers.length) {
      process.nextTick(cb.bind(this, null, knownLength));
      return;
    }
    async.parallel(this._lengthRetrievers, function(err, values) {
      if (err) {
        cb(err);
        return;
      }
      values.forEach(function(length) {
        knownLength += length;
      });
      cb(null, knownLength);
    });
  };
  FormData.prototype.submit = function(params, cb) {
    var request,
        options,
        defaults = {method: 'post'};
    ;
    if (typeof params == 'string') {
      params = parseUrl(params);
      options = populate({
        port: params.port,
        path: params.pathname,
        host: params.hostname
      }, defaults);
    } else {
      options = populate(params, defaults);
      if (!options.port) {
        options.port = options.protocol == 'https:' ? 443 : 80;
      }
    }
    options.headers = this.getHeaders(params.headers);
    if (options.protocol == 'https:') {
      request = https.request(options);
    } else {
      request = http.request(options);
    }
    this.getLength(function(err, length) {
      if (err) {
        this._error(err);
        return;
      }
      request.setHeader('Content-Length', length);
      this.pipe(request);
      if (cb) {
        request.on('error', cb);
        request.on('response', cb.bind(this, null));
      }
    }.bind(this));
    return request;
  };
  FormData.prototype._error = function(err) {
    if (!this.error) {
      this.error = err;
      this.pause();
      this.emit('error', err);
    }
  };
})(require('buffer').Buffer, require('process'));
