/* jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var shell = require('gulp-shell');
var karma = require('karma').server;

gulp.task('develop:javascript', shell.task([
    'cd web; ln -sf ../js .'
]));

gulp.task('develop:templates', shell.task([
    'python support/build-template.py -b templates/index.html -t templates/views web'
]));

gulp.task('develop:styles', shell.task([
    'sassc -m styles/default.scss web/styles/default.css; cp -rf styles/resources web/styles/'
]));

gulp.task('develop:jshint', function (callback)
{
    return gulp.src(['web/js/**/*.js'])
        .pipe($.jshint({lookup: true, devel: true}))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('develop:server', function()
{
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({port:35729}))
        .use(serveStatic('web'))
        .use(serveIndex('web'));

    require('http').createServer(app)
        .listen(9001)
        .on('listening', function()
        {
            console.log('Started a web server on http://localhost:9001');
        });
});

gulp.task('develop:clean', function(callback)
{
    var del = require('del');
    del(['web/styles/default.css',
        'web/styles/default.css.map',
        'web/js',
        'web/index.html'], function () {
    });
});

gulp.task('develop:test', function(callback)
{
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, callback);
});

gulp.task('develop', ['develop:server'], function() {
    gulp.start('develop:templates');
    gulp.start('develop:styles');
    gulp.start('develop:javascript');
    $.livereload.listen();

    gulp.watch([
        'web/js//**/*.js',
        'web/index.html',
        'web/styles/default.css'
    ]).on('change', $.livereload.changed);

    gulp.watch('templates/**/*.html', ['develop:templates']);
    gulp.watch('web/js//**/*.js', ['develop:jshint']);
    gulp.watch('styles/default.scss', ['develop:styles']);
});

/*
* Production tasks.
*/
gulp.task('production:templates', shell.task([
    'python support/build-template.py -b templates/index.html -t templates/views web'
]));

gulp.task('production:javascript', shell.task([
    'mkdir web/js; cp -rf js web/'
]));

gulp.task('production:jshint', function (callback)
{
    return gulp.src(['web/js/**/*.js'])
        .pipe($.jshint({lookup: true}))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('default', function()
{
    gulp.start('develop');
});