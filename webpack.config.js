var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'rodan-client.min.js'
    },
    module: {
 /*       rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            }
        ]*/
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9002,
        host: '0.0.0.0'
    },
    plugins: [
        new webpack.ProvidePlugin({
           jQuery: "jquery"
       })
    ]
};