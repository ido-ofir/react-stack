var webpack = require('webpack');
var path = require('path');

var config = {

    entry : {
        app : [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:3000',
            './init.jsx'
        ],
        vendors : []
    },

    devtool : '#inline-source-map',

    output : {
        path : path.join(__dirname, 'build'),
        filename : 'bundle.[name].js'
    },

    plugins : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('commons.js')
    ],

    module : {
        loaders : [
            {
                test : /\.css$/,
                loader : 'style-loader!css-loader'
            },
            {
                test : /\.scss$/,
                loader : 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel-loader?stage=1&optional=runtime']
            }
        ],
        noParse: []
    },
    resolve: {
        alias: {},
        // you can now require('file') instead of require('file.js')
        extensions: ['', '.js', '.jsx']
    }
};

function addVendor(name, path) {
    config.resolve.alias[name] = path;
    config.module.noParse.push(new RegExp(path));
    config.vendors.entry.push(name);
}


module.exports = config;