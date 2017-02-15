'use strict';

var del = require('del');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');
var gulp = require('gulp');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var gulpjshint = require('gulp-jshint');
var symlink = require('gulp-sym');
var babel = require('gulp-babel');
var rename = require("gulp-rename");

var webpackStream = require('webpack-stream');
var webpack = require('webpack');

////////////////////////////////////////////////////////////////////////////////
// Configuration
////////////////////////////////////////////////////////////////////////////////
var PORT = 9002;                                // Port for dev server.
var CONFIGURATION_FILE = 'configuration.json';  // Name of configuration file.
var DIST_DIRECTORY = 'dist';                    // Where dist will be dumped.
var SOURCE_DIRECTORY = 'js';                    // Name of Javascript source directory.
var RESOURCES_DIRECTORY = 'resources';          // Name of resources directory.
var WEB_DIRECTORY = 'web';                      // Name of directory holding development web app.
                                                // NOTE: this should correspond to where jspm creates
                                                // its config, so it's best to keep it as 'web'.
var BUNDLE_FILE = 'rodan-client.min.js';        // Name of bundle file.
var PACKAGE_FILE = 'package.json';              // Name of package file.
var INFO_FILE = 'info.json';                    // Name of info file (client info).
var PLUGINS_DIRECTORY = 'plugins';              // Name of plugins directory.
var BUNDLE_DIRECTORY = 'bundle';                // Name of bundle directory.

////////////////////////////////////////////////////////////////////////////////
// Development tasks
////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out develop.
 */
gulp.task('develop:clean', function()
{
    return del([WEB_DIRECTORY]);
});

/**
 * Make web directory.
 */
gulp.task('develop:mkdir', ['develop:clean'], function()
{
    return fs.mkdir(WEB_DIRECTORY);
});

/**
 * Build templates.
 */
gulp.task('develop:templates', ['develop:mkdir'], function(callback)
{
    execSync('python scripts/build-template.py -b templates/index-dev.html -t plugins,templates/Views ' + WEB_DIRECTORY);
    callback();
});

/**
 * Compile SCSS to CSS.
 */
gulp.task('develop:styles', ['develop:mkdir'], function()
{
    return gulp.src('styles/default.scss').pipe(sass()).pipe(gulp.dest(WEB_DIRECTORY));
});

/**
 * Creates info.json. This holds client data, such as version.
 */
gulp.task('develop:info', ['develop:mkdir'], function(callback)
{
    var json = require('./' + PACKAGE_FILE);
    var info = {
        CLIENT: {
            version: json.version + '-DEVELOPMENT'
        }
    };
    fs.writeFileSync(WEB_DIRECTORY + '/' + INFO_FILE, JSON.stringify(info, null, 4));
    callback();
});

/**
 * Links build results to web directory.
 */
gulp.task('develop:link', ['develop:mkdir'], function()
{
    return gulp.src([CONFIGURATION_FILE, PLUGINS_DIRECTORY, RESOURCES_DIRECTORY, SOURCE_DIRECTORY])
               .pipe(symlink([WEB_DIRECTORY + '/' + CONFIGURATION_FILE,
                              WEB_DIRECTORY + '/' + PLUGINS_DIRECTORY,
                              WEB_DIRECTORY + '/' + RESOURCES_DIRECTORY,
                              WEB_DIRECTORY + '/' + SOURCE_DIRECTORY], {force: true}));
});

/**
 * Run JSHint on the Javascript and create a report in the console.
 */
gulp.task('develop:jshint', function()
{
    return gulp.src([SOURCE_DIRECTORY + '/**/*.js'])
               .pipe(gulpjshint({lookup: true, devel: true}))
               .pipe(gulpjshint.reporter('jshint-stylish'))
               .pipe(gulpjshint.reporter('fail'));
});

/**
 * Start the development server.
 */
gulp.task('develop', ['develop:mkdir', 'develop:link', 'develop:templates', 'develop:styles', 'develop:info'], function(callback)
{
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(serveStatic(WEB_DIRECTORY))
        .use(serveIndex(WEB_DIRECTORY));
    require('http').createServer(app).listen(PORT);
});

////////////////////////////////////////////////////////////////////////////////
// Bundle tasks
//
// This will bundle whatever exists in WEB_DIRECTORY and throw the file into
// BUNDLE_DIRECTORY.
////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out bundle.
 */
gulp.task('bundle:clean', function()
{
    return del([BUNDLE_DIRECTORY]);
});

/**
 * Make bundle directory.
 */
gulp.task('bundle:mkdir', ['bundle:clean'], function()
{
    return fs.mkdir(BUNDLE_DIRECTORY);
});

/**
 * Bundles source JS.
 */
gulp.task('bundle', ['bundle:mkdir'], function()
{
    return gulp.src(SOURCE_DIRECTORY + '/main.js')
               .pipe(webpackStream({}, webpack))
               .pipe(rename(BUNDLE_FILE))
               .pipe(gulp.dest(BUNDLE_DIRECTORY));
});

////////////////////////////////////////////////////////////////////////////////
// Distribution tasks
//
// NOTE: this does not start a server. Rather, it simply "dists" the web 
// application such that it can easily be deployed on a web server.
////////////////////////////////////////////////////////////////////////////////
/**
 * Clean dist.
 */
gulp.task('dist:clean', function(callback)
{
    return del([DIST_DIRECTORY]);
});

/**
 * Make dist directory.
 */
gulp.task('dist:mkdir', ['dist:clean'], function()
{
    return fs.mkdir(DIST_DIRECTORY);
});

/**
 * Creates info.json. This holds client data, such as version.
 */
gulp.task('dist:info', ['dist:mkdir'], function(callback)
{
    var json = require('./' + PACKAGE_FILE);
    var info = {
        CLIENT: {
            version: json.version
        }
    };
    require('fs').writeFileSync(DIST_DIRECTORY + '/' + INFO_FILE, JSON.stringify(info, null, 4));
    callback();
});

/**
 * Compile SCSS to CSS.
 */
gulp.task('dist:styles', ['dist:mkdir'], function()
{
    return gulp.src('styles/default.scss')
               .pipe(sass())
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Build templates.
 */
gulp.task('dist:templates', ['dist:mkdir'], function(callback)
{
    execSync('python scripts/build-template.py -b templates/index.html -t plugins,templates/Views ' + DIST_DIRECTORY);
    callback();
});

/**
 * Copy files for dist.
 */
gulp.task('dist:copy:config', ['dist:mkdir'], function() 
{
    return gulp.src([CONFIGURATION_FILE, 'resources/*'], {base: './'})
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Copy some web files from libs.
 */
gulp.task('dist:copy:web', ['dist:mkdir'], function() 
{
    return gulp.src([WEB_DIRECTORY + '/libs/github/twbs/*/fonts/*', WEB_DIRECTORY + '/libs/system.js'], {base: WEB_DIRECTORY})
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Copies necessary files to DIST_DIRECTORY. This does NOT copy JS bundle.
 */
gulp.task('dist:copy', ['dist:copy:config', 'dist:copy:web'], function(callback)
{
    callback();
});

/**
 * Creates the JS bundle, transpiles, and copies to DIST_DIRECTORY.
 */
gulp.task('dist:build', ['dist:mkdir', 'bundle'], function()
{
    return gulp.src(BUNDLE_DIRECTORY + '/' + BUNDLE_FILE)
               .pipe(babel({presets: ['es2015']}))
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Make distribution.
 */
gulp.task('dist', ['dist:build', 'dist:styles', 'dist:info', 'dist:templates'/*, 'dist:copy'*/], function(callback)
{
    callback();
});

/**
 * Test the dist in a server.
 */
gulp.task('dist:server', ['dist'], function(callback)
{
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(serveStatic(DIST_DIRECTORY))
        .use(serveIndex(DIST_DIRECTORY));
    require('http').createServer(app).listen(PORT);
});

///////////////////////////////////////////////////////////////////////////////////////
// Master tasks
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', function(callback)
{
    gulp.start('develop');
    callback();
});

/**
 * Clean everything.
 */
gulp.task('clean', function(callback)
{
    gulp.start('bundle:clean');
    gulp.start('develop:clean');
    gulp.start('dist:clean');
    callback();
});

///////////////////////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Gets directories within provided directory.
 */
function getDirectories(directory)
{
    var path = require('path');
    return fs.readdirSync(directory).filter(function(file)
    {
	   return fs.statSync(path.join(directory, file)).isDirectory();
    });
}
