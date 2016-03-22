/* jshint node:true */
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var gulpjshint = require('gulp-jshint');

///////////////////////////////////////////////////////////////////////////////////////
// Configuration
///////////////////////////////////////////////////////////////////////////////////////
var PORT = 9002;
var PORT_LIVERELOAD = 35729;    // Port for Livereload. Best to keep as default.
var SOURCE_DIRECTORY = 'js';    // Name of Javascript source directory.
var WEB_DIRECTORY = 'web';      // Name of directory holding development web app.
                                // NOTE: this should correspond to where jspm creates
                                // its config, so it's best to keep it as 'web'.

///////////////////////////////////////////////////////////////////////////////////////
// Development tasks
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Make a symbolic link to the Javascript source in web.
 */
gulp.task('develop:javascript', shell.task([
    'cd ' + WEB_DIRECTORY + '; rm -f ' + SOURCE_DIRECTORY + '; ln -sf ../' + SOURCE_DIRECTORY + ' ' + SOURCE_DIRECTORY
]));

/**
 * Build all templates.
 */
gulp.task('develop:templates', shell.task([
    'python support/build-template.py -b templates/index.html -t templates/Views web'
]));

/**
 * Copy resources.
 */
gulp.task('develop:resources', shell.task([
    'cp -r resources web/'
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
gulp.task('develop:server', function()
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
 * Cleans out web.
 */
gulp.task('develop:clean', function(callback)
{
    var del = require('del');
    del([WEB_DIRECTORY + '/styles',
         WEB_DIRECTORY + '/resources',
         WEB_DIRECTORY + '/' + SOURCE_DIRECTORY,
         WEB_DIRECTORY + '/index.html'],
        function() {});
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
 * Build the development environment.
 */
gulp.task('develop:build', function()
{
    gulp.start('develop:resources');
    gulp.start('develop:templates');
    gulp.start('develop:styles');
    gulp.start('develop:javascript'); 
});

/**
 * Run development.
 */
gulp.task('develop', ['develop:build', 'develop:server'], function()
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
// NOTE: this does not start a server. Rather, it simply "builds" the web application
// such that it can easily be deployed on a web server.
///////////////////////////////////////////////////////////////////////////////////////
//...

///////////////////////////////////////////////////////////////////////////////////////
// Detaults
///////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', function()
{
    gulp.start('develop');
});
