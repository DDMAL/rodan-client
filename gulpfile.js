'use strict';

////////////////////////////////////////////////////////////////////////////////
// REQUIRE
////////////////////////////////////////////////////////////////////////////////
const async = require('async');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const ip = require('ip');
const path = require('path');
const recread = require('recursive-readdir');
const sass = require('gulp-sass');
const symlink = require('gulp-sym');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");

////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION - Develop
////////////////////////////////////////////////////////////////////////////////
const DEVELOP_HOST = ip.address();
const DEVELOP_PORT = 9002;
const DEVELOP_SOURCEMAP = 'eval-source-map';
const DEVELOP_WEBROOT = '__develop__';

////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION - Dist
////////////////////////////////////////////////////////////////////////////////
const DIST_WEBROOT = 'dist';

////////////////////////////////////////////////////////////////////////////////
// NOTE: don't edit this unless you know what you're doing.
////////////////////////////////////////////////////////////////////////////////
const CONFIGURATION_FILE = 'configuration.json';
const CONFIGURATION_EXAMPLE_FILE = 'configuration.example.json';
const ENTRY_FILE = './src/js/main.js';
const INFO_FILE = 'info.json';
const NODE_MODULES_DIRECTORY = 'node_modules';
const OUTPUT_FILE = 'rodan_client.min.js';
const PACKAGE_FILE = 'package.json';
const PLUGINS_INCLUSION_FILE = 'plugins.json';
const PLUGINS_FILE = '.plugins.js';
const RESOURCES_DIRECTORY = 'resources';
const SOURCE_DIRECTORY = 'src/js';
const TEMPLATE_DIRECTORY = 'templates';

////////////////////////////////////////////////////////////////////////////////
// WEBPACK
////////////////////////////////////////////////////////////////////////////////
var webpackConfig = 
{
    entry: ENTRY_FILE,
    output: 
    {
        filename: OUTPUT_FILE
    },
    module: {rules: []},
    resolve:
    {
        modules: [
            path.resolve(__dirname + '/src'),
            path.resolve(__dirname + '/node_modules')
        ]
    },
    plugins: [new webpack.ProvidePlugin({jQuery: "jquery"})]
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
    // Get plugin templates. When done, get the main templates.
    var pluginList = getPluginList();
    var pluginTemplates = '';
    async.each(pluginList, function(plugin, done)
    {
        var pluginPath = path.resolve(__dirname, NODE_MODULES_DIRECTORY + '/' + plugin + '/templates');
        buildTemplates(pluginPath, [], function(error, templates)
        {
            if (error)
            {
                done(error);
            }
            pluginTemplates += templates;
            done();
        });
    },
    function(error)
    {
        if (error)
        {
            callback(error);
        }

        // Get the main templates.
        buildTemplates(TEMPLATE_DIRECTORY, ['index.html'], function(err, mainTemplates)
        {
            var indexFile = fs.readFileSync(TEMPLATE_DIRECTORY + '/index.html', 'utf8'); 
            indexFile = indexFile.replace('{templates}', mainTemplates + pluginTemplates);
            fs.writeFileSync(DEVELOP_WEBROOT + '/index.html', indexFile); 
            callback();
        }); 
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
 * Creates info.json. This holds client data, such as version. It's basically
 * a trimmed 'package.json'.
 */
gulp.task('develop:info', ['develop:mkdir'], function(callback)
{
    var info = createInfo(function(err, data)
    {
        fs.writeFileSync(DEVELOP_WEBROOT + '/' + INFO_FILE, JSON.stringify(data, null, 4));
        callback();
    });
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
gulp.task('develop', ['plugins:import', 'develop:mkdir', 'develop:config', 'develop:link', 'develop:templates', 'develop:styles', 'develop:info'], function(callback)
{
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, webpackServerConfig);
    server.listen(DEVELOP_PORT, DEVELOP_HOST, function(err)
    {
        console.log('');
        console.log('==========');
        console.log('Starting server on: http://' + DEVELOP_HOST + ':' + DEVELOP_PORT);
        console.log('Serving: ' + DEVELOP_WEBROOT);
        console.log('');
        console.log('Make sure ' + DEVELOP_HOST + ':' + DEVELOP_PORT + ' is allowed access to the Rodan server');
        console.log('==========');
        console.log('');
    });
});

////////////////////////////////////////////////////////////////////////////////
// TASKS - Distribution
////////////////////////////////////////////////////////////////////////////////
/**
 * Cleans out dist.
 */
gulp.task('dist:clean', function()
{
    return del([DIST_WEBROOT]);
});

/**
 * Make dist directory.
 */
gulp.task('dist:mkdir', ['dist:clean'], function(callback)
{
    return fs.mkdir(DIST_WEBROOT, callback);
});

/**
 * Build Webpack configs for dist.
 */
gulp.task('dist:config', function(callback)
{
    var babelRule = 
    {
        test: /\.(js)$/,
        use: 'babel-loader'
    };
    webpackConfig.module.rules.push(babelRule);
    webpackConfig.output.path = path.resolve(__dirname, DIST_WEBROOT);
    callback();
});

/**
 * Build templates.
 */
gulp.task('dist:templates', ['dist:mkdir'], function(callback)
{
    // Get plugin templates. When done, get the main templates.
    var pluginList = getPluginList();
    var pluginTemplates = '';
    async.each(pluginList, function(plugin, done)
    {
        var pluginPath = path.resolve(__dirname, NODE_MODULES_DIRECTORY + '/' + plugin + '/templates');
        buildTemplates(pluginPath, [], function(error, templates)
        {
            if (error)
            {
                done(error);
            }
            pluginTemplates += templates;
            done();
        });
    },
    function(error)
    {
        if (error)
        {
            callback(error);
        }

        // Get the main templates.
        buildTemplates(TEMPLATE_DIRECTORY, ['index.html'], function(err, mainTemplates)
        {
            var indexFile = fs.readFileSync(TEMPLATE_DIRECTORY + '/index.html', 'utf8'); 
            indexFile = indexFile.replace('{templates}', mainTemplates + pluginTemplates);
            fs.writeFileSync(DIST_WEBROOT + '/index.html', indexFile); 
            callback();
        }); 
    });
});

/**
 * Compile SCSS to CSS.
 */
gulp.task('dist:styles', ['dist:mkdir'], function()
{
    return gulp.src('styles/default.scss')
               .pipe(sass())
               .pipe(gulp.dest(DIST_WEBROOT));
});

/**
 * Creates info.json.
 */
gulp.task('dist:info', ['dist:mkdir'], function(callback)
{
    var info = createInfo(function(err, data)
    {
        fs.writeFileSync(DIST_WEBROOT + '/' + INFO_FILE, JSON.stringify(data, null, 4));
        callback();
    });
});

/**
 * Copy stuff to dist.
 */
gulp.task('dist:copy', ['dist:mkdir'], function()
{
    return gulp.src([RESOURCES_DIRECTORY + '/*', CONFIGURATION_EXAMPLE_FILE, PACKAGE_FILE], {base: './'})
               .pipe(gulp.dest(DIST_WEBROOT));
});

/**
 * Bundle (Webpack) for distribution.
 */
gulp.task('dist', ['plugins:import', 'dist:mkdir', 'dist:config', 'dist:copy', 'dist:templates', 'dist:styles', 'dist:info'], function(callback)
{
    webpack(webpackConfig, callback);
});

////////////////////////////////////////////////////////////////////////////////
// TASKS - Master
////////////////////////////////////////////////////////////////////////////////
/**
 * Default task (develop).
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
    gulp.start('dist:clean');
    callback();
});

////////////////////////////////////////////////////////////////////////////////
// TASKS - Plugins
////////////////////////////////////////////////////////////////////////////////
/**
 * Create '.plugins.js' based on contents of config.
 */
gulp.task('plugins:import', function(callback)
{
    var pluginList = getPluginList();
    var pluginsPath = path.resolve(__dirname, SOURCE_DIRECTORY + '/' + PLUGINS_FILE);
    var plugins = '';
    for (var i = 0; i < pluginList.length; i++)
    {
        plugins += 'import \'' + pluginList[i] + '\';\n';
    }
    fs.writeFileSync(pluginsPath, plugins);
    callback();
});

////////////////////////////////////////////////////////////////////////////////
// UTILITIES
////////////////////////////////////////////////////////////////////////////////
/**
 * Returns '<script>'-enclosed templates to be placed in index.html.
 */
function buildTemplates(directory, ignoreArray, callback)
{
    recread(directory, ignoreArray, function(err, files) 
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
        callback(null, templates);
    });
}

/**
 * Creates data for info.json.
 */
function createInfo(callback)
{
    var json = require('./' + PACKAGE_FILE);
    var info = {CLIENT: json};
    callback(null, info);
}

/**
 * Reads config file to determine which plugins should be included.
 */
function getPluginList()
{
    var pluginsInclusionFile = path.resolve(__dirname, PLUGINS_INCLUSION_FILE);
    try
    {
        var plugins = require(pluginsInclusionFile);
        return Object.keys(plugins);
    }
    catch (error)
    {
        return [];
    }
}