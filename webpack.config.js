const webpack = require('webpack'); 
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
 
module.exports = {
    watch: true,
 
    // development | production 
    mode: 'production',
    
    entry: {
        'jquery.vmodel': './src/index.js'
        // "jquery.vmodel": './src/jquery.vmodel.js',
        // 'jquery.vmodeltest': './src/jquery.vmodeltest.js',
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: '[name].min.js'
    },

    devtool: 'source-map',

    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]

};