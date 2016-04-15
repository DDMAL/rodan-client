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
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var http = require('http');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var gulp_jspm = require('gulp-jspm');
var rename = require("gulp-rename");

///////////////////////////////////////////////////////////////////////////////////////
// Configuration
///////////////////////////////////////////////////////////////////////////////////////
var PORT = 9001;                                // Port for dev server.
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
var BUILD_DIRECTORY = 'build';                  // Name of build directory.
var PLUGINS_DIRECTORY = 'plugins';              // Name of plugins directory.

///////////////////////////////////////////////////////////////////////////////////////
// Development tasks
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out develop.
 */
gulp.task('develop:clean', function()
{
    return del([WEB_DIRECTORY + '/**/*',
                '!' + WEB_DIRECTORY + '/config.js',
                '!' + WEB_DIRECTORY + '/libs',
                '!' + WEB_DIRECTORY + '/libs/**/*']);
});

/**
 * Build templates.
 */
gulp.task('develop:templates', function(callback)
{
    execSync('python scripts/build-template.py -b templates/index-dev.html -t plugins,templates/Views ' + WEB_DIRECTORY);
    callback();
});

/**
 * Compile SCSS to CSS.
 */
gulp.task('develop:styles', function()
{
    return gulp.src('styles/default.scss').pipe(sass()).pipe(gulp.dest(WEB_DIRECTORY));
});

/**
 * Creates info.json. This holds client data, such as version.
 */
gulp.task('develop:info', function(callback)
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
gulp.task('develop:link', function()
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
gulp.task('develop', ['develop:link', 'develop:templates', 'develop:styles', 'develop:info'], function(callback)
{
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(serveStatic(WEB_DIRECTORY))
        .use(serveIndex(WEB_DIRECTORY));
    require('http').createServer(app).listen(PORT);
});

///////////////////////////////////////////////////////////////////////////////////////
// Build tasks
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out build.
 */
gulp.task('build:clean', function()
{
    return del([BUILD_DIRECTORY]);
});

/**
 * Make build directory.
 */
gulp.task('build:mkdir', ['build:clean'], function()
{
    return fs.mkdir(BUILD_DIRECTORY);
});

/**
 * Copy all files to build.
 */
gulp.task('build:copy', ['build:mkdir'], function() 
{
    return gulp.src([WEB_DIRECTORY + '/libs/*', WEB_DIRECTORY + '/config.js'], {base: WEB_DIRECTORY})
               .pipe(gulp.dest(BUILD_DIRECTORY));
});

/**
 * Transpile source JS.
 */
gulp.task('build:source', ['build:mkdir'], function()
{
    return gulp.src(SOURCE_DIRECTORY + '/**/*.js')
               .pipe(babel({presets: ['es2015']}))
               .pipe(gulp.dest(BUILD_DIRECTORY + '/' + SOURCE_DIRECTORY));
});

/**
 * Transpile plugins JS.
 */
gulp.task('build:plugins', ['build:mkdir'], function()
{
    var plugins = getDirectories(PLUGINS_DIRECTORY);
    var pluginsGlobbed = [];
    for (var i = 0; i < plugins.length; i++)
    {
        pluginsGlobbed.push(PLUGINS_DIRECTORY + '/' + plugins[i] + '/**/*.js');
    }
    return gulp.src(pluginsGlobbed, {base: PLUGINS_DIRECTORY})
               .pipe(babel({presets: ['es2015']}))
               .pipe(gulp.dest(BUILD_DIRECTORY + '/' + PLUGINS_DIRECTORY));
});

/**
 * Does the transpiling.
 */
gulp.task('build', ['build:copy', 'build:source', 'build:plugins'], function(callback)
{
    callback();
});

///////////////////////////////////////////////////////////////////////////////////////
// Production tasks
//
// NOTE: this does not start a server. Rather, it simply "dists" the web application
// such that it can easily be deployed on a web server.
///////////////////////////////////////////////////////////////////////////////////////
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
    return gulp.src('styles/default.scss').pipe(sass()).pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Build templates.
 */
gulp.task('dist:templates', ['dist:mkdir'], function(callback)
{
    execSync('python scripts/build-template.py -b templates/index-dev.html -t plugins,templates/Views ' + DIST_DIRECTORY);
    callback();
});

/**

/**
 * Copy files for dist.
 */
gulp.task('dist:copy', ['dist:mkdir'], function() 
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
 * Links build results to web directory.
 */
gulp.task('dist:link', ['build'], function(callback)
{
    return gulp.src([BUILD_DIRECTORY + '/' + SOURCE_DIRECTORY, BUILD_DIRECTORY + '/' + PLUGINS_DIRECTORY])
               .pipe(symlink([WEB_DIRECTORY + '/' + SOURCE_DIRECTORY, WEB_DIRECTORY + '/' + PLUGINS_DIRECTORY], {force: true}));
});

/**
 * Bundles source JS.
 */
gulp.task('dist:bundle:source', ['dist:link'], function()
{
    return gulp.src(WEB_DIRECTORY + '/' + SOURCE_DIRECTORY + '/main.js')
               .pipe(gulp_jspm({selfExecutingBundle: true/*, minify: true*/}))
               .pipe(rename(BUNDLE_FILE))
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Bundles plugins JS.
 */
gulp.task('dist:bundle:plugins', ['dist:link'], function(callback)
{
    var plugins = getDirectories(WEB_DIRECTORY + '/' + PLUGINS_DIRECTORY);
    var pluginsGlobbed = [];
    for (var i = 0; i < plugins.length; i++)
    {
        pluginsGlobbed.push(WEB_DIRECTORY + '/' + PLUGINS_DIRECTORY + '/' + plugins[i] + '/js/' + plugins[i] + '.js');
    }
    return gulp.src(pluginsGlobbed, {base: WEB_DIRECTORY})
               .pipe(gulp_jspm())
               .pipe(rename(function(path) { path.basename = path.basename.substring(0, path.basename.length - 7); }))
               .pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Bundles JS.
 */
gulp.task('dist:bundle', ['dist:bundle:source', 'dist:bundle:plugins'], function(callback)
{
    callback();
});

/**
 * Make distribution.
 */
gulp.task('dist', ['dist:bundle', 'dist:styles', 'dist:info', 'dist:templates', 'dist:copy', 'dist:copy:web'], function(callback)
{
    callback();
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
    gulp.start('build:clean');
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
