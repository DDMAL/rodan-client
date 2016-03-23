'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var gulpjshint = require('gulp-jshint');

///////////////////////////////////////////////////////////////////////////////////////
// Configuration
///////////////////////////////////////////////////////////////////////////////////////
var PORT = 9002;
var PORT_LIVERELOAD = 35729;                // Port for Livereload. Best to keep as default.
var DIST_DIRECTORY = 'dist';                // Where dist will be dumped.
var SOURCE_DIRECTORY = 'js';                // Name of Javascript source directory.
var RESOURCES_DIRECTORY = 'resources';      // Name of resources directory.
var WEB_DIRECTORY = 'web';                  // Name of directory holding development web app.
                                            // NOTE: this should correspond to where jspm creates
                                            // its config, so it's best to keep it as 'web'.
var MINIFIED_FILE = 'rodan-client.js.min';  // Name of minified file.

///////////////////////////////////////////////////////////////////////////////////////
// Development tasks
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Build templates.
 */
gulp.task('develop:templates', shell.task([
    'python support/build-template.py -b templates/index.html -t templates/Views ' + WEB_DIRECTORY
]));

/**
 * Compile SCSS to CSS.
 */
gulp.task('develop:styles', shell.task([
    'mkdir -p ' + WEB_DIRECTORY + '/styles',
    'sassc -m styles/default.scss ' + WEB_DIRECTORY + '/styles/default.css',
    'cp -rf styles/resources ' + WEB_DIRECTORY + '/styles/'
]));

/**
 * Links build results to web directory.
 */
gulp.task('develop:link', shell.task([
    'cd ' + WEB_DIRECTORY + '; rm -f ' + SOURCE_DIRECTORY + '; ln -sf ../' + SOURCE_DIRECTORY + ' ' + SOURCE_DIRECTORY,
    'cd ' + WEB_DIRECTORY + '; rm -f ' + RESOURCES_DIRECTORY + '; ln -sf ../' + RESOURCES_DIRECTORY + ' ' + RESOURCES_DIRECTORY
]));

/**
 * Run JSHint on the Javascript and create a report in the console.
 */
gulp.task('develop:jshint', function (callback)
{
    return gulp.src([WEB_DIRECTORY + '/' + SOURCE_DIRECTORY + '/**/*.js'])
        .pipe(gulpjshint({lookup: true, devel: true}))
        .pipe(gulpjshint.reporter('jshint-stylish'))
        .pipe(gulpjshint.reporter('fail'));
});

/**
 * Start the development server.
 */
gulp.task('develop:server', ['develop:link', 'develop:templates', 'develop:styles'], function()
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

    gulp.watch('templates/**/*.html', ['build:templates']);
    gulp.watch(SOURCE_DIRECTORY + '/**/*.js', ['develop:jshint']);
    gulp.watch('styles/default.scss', ['build:styles']);
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
 * Clean dist.
 */
gulp.task('dist:clean', function()
{
    var del = require('del');
    del([DIST_DIRECTORY], function() {});
});

/**
 * Copy files for dist.
 */
gulp.task('dist:resources', ['dist:mkdir'], shell.task(
[
    'cp -r resources ' + DIST_DIRECTORY + '/'
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
gulp.task('dist:styles', ['dist:mkdir'], shell.task([
    'mkdir -p ' + DIST_DIRECTORY + '/styles',
    'sassc -m styles/default.scss ' + DIST_DIRECTORY + '/styles/default.css',
    'cp -rf styles/resources ' + DIST_DIRECTORY + '/styles/'
]));

/**
 * Make distribution.
 */
gulp.task('dist', ['dist:mkdir'], function()
{
    var sourcemaps = require('gulp-sourcemaps');
    var babel = require('gulp-babel');
    var concat = require('gulp-concat');

    gulp.start('dist:templates');
    gulp.start('dist:styles');
    gulp.start('dist:resources');

    gulp.src(SOURCE_DIRECTORY + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat(MINIFIED_FILE))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIRECTORY));
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