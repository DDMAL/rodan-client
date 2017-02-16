'use strict';

////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION - Develop
////////////////////////////////////////////////////////////////////////////////
const DEVELOP_HOST = '132.206.14.112';
const DEVELOP_PORT = 9002;
const DEVELOP_SOURCEMAP = 'eval-source-map';

////////////////////////////////////////////////////////////////////////////////
// NOTE: don't edit this unless you know what you're doing.
////////////////////////////////////////////////////////////////////////////////
const CONFIGURATION_FILE = 'configuration.json';
const DEVELOP_WEBROOT = '__develop__';
const ENTRY_FILE = './js/main.js';
const INFO_FILE = 'info.json';
const OUTPUT_FILE = 'rodan_client.min.js';
const PACKAGE_FILE = 'package.json';
const PLUGINS_DIRECTORY = 'plugins';
const RESOURCES_DIRECTORY = 'resources';
const SOURCE_DIRECTORY = 'js';
const TEMPLATE_DIRECTORY = 'templates';

////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////
const del = require('del');
const execSync = require('child_process').execSync;
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const recread = require('recursive-readdir');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const symlink = require('gulp-sym');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");

var webpackConfig = 
{
    entry: ENTRY_FILE,
    output: 
    {
        filename: OUTPUT_FILE
    },
    module: {
 /*       rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            }
        ]*/
    },
    plugins: [
        new webpack.ProvidePlugin({
           jQuery: "jquery"
       })
    ]
};

var webpackServerConfig = {};

////////////////////////////////////////////////////////////////////////////////
// TASKS - Develop
////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out develop.
 */
gulp.task('develop:clean', function()
{
    return del([DEVELOP_WEBROOT]);
});

/**
 * Make web directory.
 */
gulp.task('develop:mkdir', ['develop:clean'], function(callback)
{
    return fs.mkdir(DEVELOP_WEBROOT, callback);
});

/**
 * Build Webpack configs for develop.
 */
gulp.task('develop:config', function(callback)
{
    webpackConfig.devtool = DEVELOP_SOURCEMAP;
    webpackConfig.output.path = path.resolve(__dirname, DEVELOP_WEBROOT);
    webpackServerConfig.contentBase = DEVELOP_WEBROOT;
    callback();
});

/**
 * Build templates.
 */
gulp.task('develop:templates', ['develop:mkdir'], function(callback)
{
    recread(TEMPLATE_DIRECTORY, ['index.html'], function(err, files) 
    {
        var templates = '';
        for (var index in files)
        {
            var filename = files[index];
            var templateName = filename.substring(filename.lastIndexOf('/') + 1);
            templateName = templateName.substring(0, templateName.length - 5);
            var data = fs.readFileSync(files[index], 'utf8'); 
            templates += '<script type="text/template" id="' + templateName + '">';
            templates += data;
            templates += '</script>';
        }
        var indexFile = fs.readFileSync(TEMPLATE_DIRECTORY + '/index.html', 'utf8'); 
        indexFile = indexFile.replace('{templates}', templates);
        fs.writeFileSync(DEVELOP_WEBROOT + '/index.html', indexFile);
        callback();
    });
});

/**
 * Compile SCSS to CSS.
 */
gulp.task('develop:styles', ['develop:mkdir'], function()
{
    return gulp.src('styles/default.scss')
               .pipe(sass())
               .pipe(gulp.dest(DEVELOP_WEBROOT));
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
    fs.writeFileSync(DEVELOP_WEBROOT + '/' + INFO_FILE, JSON.stringify(info, null, 4));
    callback();
});

/**
 * Links build results to web directory.
 */
gulp.task('develop:link', ['develop:mkdir'], function()
{
    return gulp.src([CONFIGURATION_FILE, RESOURCES_DIRECTORY])
               .pipe(symlink([DEVELOP_WEBROOT + '/' + CONFIGURATION_FILE,
                              DEVELOP_WEBROOT + '/' + RESOURCES_DIRECTORY], {force: true}));
});

/**
 * Bundle (Webpack) and start the development server.
 */
gulp.task('develop', ['develop:mkdir', 'develop:config', 'develop:link', 'develop:templates', 'develop:styles', 'develop:info'], function(callback)
{
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, webpackServerConfig);
    server.listen(DEVELOP_PORT, DEVELOP_HOST, function(err)
    {
        console.log('Starting server on: http://' + DEVELOP_HOST + ':' + DEVELOP_PORT);
        console.log('Serving: ' + DEVELOP_WEBROOT);
    });
});

////////////////////////////////////////////////////////////////////////////////
// TASKS - Master
////////////////////////////////////////////////////////////////////////////////
/**
 * Default task.
 */
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
    gulp.start('develop:clean');
    callback();
});