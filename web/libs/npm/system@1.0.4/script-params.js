/* */ 
"use strict";
var URL = require('./browser-url');
module.exports = getParams;
function getParams(scriptName) {
  var i,
      j,
      match,
      script,
      location,
      attr,
      name,
      re = new RegExp("^(.*)" + scriptName + "(?:[\\?\\.]|$)", "i");
  var params = {};
  var scripts = document.getElementsByTagName("script");
  for (i = 0; i < scripts.length; i++) {
    script = scripts[i];
    if (scriptName && script.src && (match = script.src.match(re))) {
      location = match[1];
    }
    if (location) {
      if (script.dataset) {
        for (name in script.dataset) {
          if (script.dataset.hasOwnProperty(name)) {
            params[name] = script.dataset[name];
          }
        }
      } else if (script.attributes) {
        var dataRe = /^data-(.*)$/,
            letterAfterDash = /-([a-z])/g,
            upperCaseChar = function(_, c) {
              return c.toUpperCase();
            };
        for (j = 0; j < script.attributes.length; j++) {
          attr = script.attributes[j];
          match = attr.name.match(/^data-(.*)$/);
          if (match) {
            params[match[1].replace(letterAfterDash, upperCaseChar)] = attr.value;
          }
        }
      }
      script.parentNode.removeChild(script);
      params.location = location;
      break;
    }
  }
  return params;
}
