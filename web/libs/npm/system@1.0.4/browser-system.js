/* */ 
"use strict";
var Q = require('q');
var CommonSystem = require('./common-system');
module.exports = BrowserSystem;
function BrowserSystem(location, description, options) {
  var self = this;
  CommonSystem.call(self, location, description, options);
}
BrowserSystem.prototype = Object.create(CommonSystem.prototype);
BrowserSystem.prototype.constructor = BrowserSystem;
BrowserSystem.load = CommonSystem.load;
BrowserSystem.prototype.read = function read(location, charset, contentType) {
  var request = new XMLHttpRequest();
  var response = Q.defer();
  function onload() {
    if (xhrSuccess(request)) {
      response.resolve(request.responseText);
    } else {
      onerror();
    }
  }
  function onerror() {
    var error = new Error("Can't XHR " + JSON.stringify(location));
    if (request.status === 404 || request.status === 0) {
      error.code = "ENOENT";
      error.notFound = true;
    }
    response.reject(error);
  }
  try {
    request.open("GET", location, true);
    if (contentType && request.overrideMimeType) {
      request.overrideMimeType(contentType);
    }
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        onload();
      }
    };
    request.onload = request.load = onload;
    request.onerror = request.error = onerror;
    request.send();
  } catch (exception) {
    response.reject(exception);
  }
  return response.promise;
};
function xhrSuccess(req) {
  return (req.status === 200 || (req.status === 0 && req.responseText));
}
