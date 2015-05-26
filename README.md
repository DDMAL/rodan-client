# vis-client
VIS client (Rodan)

Temporary stuff:

If you get a 'Deferred' error when loading marionette, you have to fix backbone. To to your npm/backbone@x.x.x/backbone.js and adjust this:


    } else if (typeof exports !== 'undefined') {
      var _ = require("underscore");
      factory(root, exports, _);
    } else {
    

to this:

    } else if (typeof exports !== 'undefined') {
      var _ = require("underscore");
      var $ = require("jquery");
      factory(root, exports, _, $);
    } else {

This issue is known. Refer to https://github.com/jspm/registry/issues/234
