'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');

///////////////////////////////////////////////////////////////////////////////////////
// Configuration
///////////////////////////////////////////////////////////////////////////////////////
var PORT = 9001;                                // Port for dev server.
var PORT_LIVERELOAD = 35729;                    // Port for Livereload. Best to keep as default.
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

///////////////////////////////////////////////////////////////////////////////////////
// Development tasks
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Build templates.
 */
gulp.task('develop:templates', shell.task([
    'python support/build-template.py -b templates/index-dev.html -t templates/Views ' + WEB_DIRECTORY
]));

/**
 * Compile SCSS to CSS.
 */
gulp.task('develop:styles', function()
{
    var sass = require('gulp-sass');
    gulp.src('styles/default.scss').pipe(sass()).pipe(gulp.dest(WEB_DIRECTORY));
});

/**
 * Creates info.json. This holds client data, such as version.
 */
gulp.task('develop:info', function()
{
    var json = require('./' + PACKAGE_FILE);
    var info = {
        version: json.version + '-DEVELOPMENT'
    };
    require('fs').writeFileSync(WEB_DIRECTORY + '/' + INFO_FILE, JSON.stringify(info, null, 4));
});

/**
 * Links build results to web directory.
 */
gulp.task('develop:link', shell.task([
    'cd ' + WEB_DIRECTORY + '; rm -f ' + SOURCE_DIRECTORY + '; ln -sf ../' + SOURCE_DIRECTORY + ' ' + SOURCE_DIRECTORY,
    'cd ' + WEB_DIRECTORY + '; rm -f ' + RESOURCES_DIRECTORY + '; ln -sf ../' + RESOURCES_DIRECTORY + ' ' + RESOURCES_DIRECTORY,
    'cd ' + WEB_DIRECTORY + '; rm -f ' + CONFIGURATION_FILE + '; ln -sf ../' + CONFIGURATION_FILE + ' .'
]));

/**
 * Run JSHint on the Javascript and create a report in the console.
 */
gulp.task('develop:jshint', function (callback)
{
    var gulpjshint = require('gulp-jshint');
    return gulp.src([WEB_DIRECTORY + '/' + SOURCE_DIRECTORY + '/**/*.js'])
        .pipe(gulpjshint({lookup: true, devel: true}))
        .pipe(gulpjshint.reporter('jshint-stylish'))
        .pipe(gulpjshint.reporter('fail'));
});

/**
 * Start the development server.
 */
gulp.task('develop:server', ['develop:link', 'develop:templates', 'develop:styles', 'develop:info'], function()
{
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({port:PORT_LIVERELOAD}))
        .use(serveStatic(WEB_DIRECTORY))
        .use(serveIndex(WEB_DIRECTORY));
    require('http').createServer(app).listen(PORT);
});

/**
 * Run development tests.
 */
gulp.task('develop:test', function(callback)
{
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, callback);
});

/**
 * Cleans out develop.
 */
gulp.task('develop:clean', function(callback)
{
    var del = require('del');
    del([WEB_DIRECTORY + '/styles',
         WEB_DIRECTORY + '/' + RESOURCES_DIRECTORY,
         WEB_DIRECTORY + '/' + SOURCE_DIRECTORY,
         WEB_DIRECTORY + '/' + CONFIGURATION_FILE,
         WEB_DIRECTORY + '/' + INFO_FILE,
         WEB_DIRECTORY + '/*.css',
         WEB_DIRECTORY + '/index.html'],
        function() {});
});

/**
 * Run development.
 */
gulp.task('develop', ['develop:server'], function()
{
    var livereload = require('gulp-livereload');
    livereload.listen();

    gulp.watch([
        WEB_DIRECTORY + '/js//**/*.js',
        WEB_DIRECTORY + '/index.html',
        WEB_DIRECTORY + '/styles/default.css'
    ]).on('change', livereload.changed);

    gulp.watch('templates/**/*.html', ['develop:templates']);
    gulp.watch(SOURCE_DIRECTORY + '/**/*.js', ['develop:jshint']);
    gulp.watch('styles/default.scss', ['develop:styles']);
});

///////////////////////////////////////////////////////////////////////////////////////
// Production tasks
//
// NOTE: this does not start a server. Rather, it simply "dists" the web application
// such that it can easily be deployed on a web server.
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Make dist directory.
 */
gulp.task('dist:mkdir', shell.task([
    'mkdir -p ' + DIST_DIRECTORY
]));

/**
 * Links JS into web directory. We need to do this so jspm bundle (gulp-jspm) can work.
 */
gulp.task('dist:link', shell.task([
    'cd ' + WEB_DIRECTORY + '; rm -f ' + SOURCE_DIRECTORY + '; ln -sf ../' + SOURCE_DIRECTORY + ' ' + SOURCE_DIRECTORY
]));

/**
 * Clean dist.
 */
gulp.task('dist:clean', function()
{
    var del = require('del');
    del([DIST_DIRECTORY], function() {});
});

/**
 * Creates info.json. This holds client data, such as version.
 */
gulp.task('dist:info', ['dist:mkdir'], function()
{
    var json = require('./' + PACKAGE_FILE);
    var info = {
        version: json.version
    };
    require('fs').writeFileSync(DIST_DIRECTORY + '/' + INFO_FILE, JSON.stringify(info, null, 4));
});

/**
 * Copy files for dist.
 */
gulp.task('dist:copy', ['dist:mkdir'], shell.task(
[
    'cp ' + CONFIGURATION_FILE + ' ' + DIST_DIRECTORY + '/',
    'cp -r resources ' + DIST_DIRECTORY + '/',
    'cd ' + WEB_DIRECTORY + '; cp -Rf --parent libs/github/twbs/*/fonts/ ../' + DIST_DIRECTORY
]));

/**
 * Build templates.
 */
gulp.task('dist:templates', ['dist:mkdir'], shell.task([
    'python support/build-template.py -b templates/index.html -t templates/Views ' + DIST_DIRECTORY
]));

/**
 * Compile SCSS to CSS.
 */
gulp.task('dist:styles', ['dist:mkdir'], function()
{
    var sass = require('gulp-sass');
    gulp.src('styles/default.scss').pipe(sass()).pipe(gulp.dest(DIST_DIRECTORY));
});

/**
 * Make distribution.
 */
gulp.task('dist', ['dist:mkdir', 'dist:info', 'dist:link', 'dist:templates', 'dist:styles', 'dist:copy'], function()
{
    var gulp_jspm = require('gulp-jspm');
    var rename = require("gulp-rename");
    gulp.src(WEB_DIRECTORY + '/' + SOURCE_DIRECTORY + '/main.js')
        .pipe(gulp_jspm({selfExecutingBundle: true/*, minify: true*/}))
        .pipe(rename(BUNDLE_FILE))
        .pipe(gulp.dest(DIST_DIRECTORY))
});

///////////////////////////////////////////////////////////////////////////////////////
// Master tasks
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', function()
{
    gulp.start('develop');
});

/**
 * Clean everything.
 */
gulp.task('clean', function()
{
    gulp.start('dist:clean');
    gulp.start('develop:clean');
});