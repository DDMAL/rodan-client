- install node (global)
- install npm (global)

THIS IS JUST A WORKING LIST OF REQS AND NOT A REAL README!

dev dependencies - app
this stuff will exist in the web app
==================
- jspm: package manager for node stuff we need in our app

dev dependencies - server
this is stuff that will put together a dev web server for our app
==================
Note: 'http' is core Node

OPTIONAL - reload on the fly
- connect: HTTP server that allows us to use connect-livereload
- connect-livereload: this will push changes in the web page to the browser
- gulp-livereload: use livereload in gulp

OPTIONAL (need to explain more)
use these in concert with connect and connect-livereload
- serve-index: serves the files of a directory
- serve-static: serve file from root directory

OPTIONAL
- jshint: test javascript for errors, formatting
- jshint-stylish: gives a nice, colorful jshint report
- gulp-jshint: use jshint in gulp

REQUIRED
- babel-preset-es2015: rules that babel will use to transpile our beautiful source code
- del: delete stuff
- gulp-babel: lets us use babel inside a gulp file...how nice
- gulp-concat: SMUSH THINGS TOGETHER!
- gulp-sourcemap: create Javascript sourcemap for those debugging types of people
- gulp-shell: access shell from gulp
- gulp: gulp...duh
- gulp-cli: cli for gulp (./node-modules/.bin/gulp)


OPTIONAL - TESTING
"karma-babel-preprocessor": "^4.0.0",
"karma-chrome-launcher": "^0.1.7",
"karma-coverage": "^0.3.1",
"karma-jasmine": "^0.3.5",
"karma-jspm": "^1.1.4",
"karma-mocha-reporter": "^1.0.2",
"karma-phantomjs-launcher": "^0.1.4",
"karma-sinon": "^1.0.4",

JSPM
============

"backbone": hot shit for models, collections, all your rest data
"backbone.babysitter": required by marionette???
"backbone.marionette": the V in MVC of backbone
"backbone.radio": great event system
"backbone.wreqr": required by marionette...?
css - allows loading of css in JS; useful so we don't have to write the CSS link  path in html
"datetimepicker": handy little date/time picker
"filesaver": because some people (i.e. browsers) haven't implemented "saveAs" yet
"jquery": OBVIOUS
jqueryui: lets us do some jquery manipulation in the table behavior file
"json-editor": loads json schema
"moment": helpful with date formating
"paper": canvas graphics!!!1
"twbs/bootstrap": STYLISH SHIT!
"underscore": templates and other helpful things
