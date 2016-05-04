/* */ 
var test = require('test');
var config = require('./package.json!systemjs-json');
test.assert(config.name === "json-spec");
test.print("DONE", "info");
