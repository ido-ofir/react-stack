var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'build');
var appPath = path.resolve(__dirname, 'app', 'app.jsx');


var config = {

    entry : {
        app : [
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/only-dev-server',
            appPath
        ]
    },

    devtool : 'eval',

    output: {
        path : path.join(__dirname, 'build'),
        filename : 'bundle.js',
        publicPath: '/build/'
    },

    plugins : [
        new webpack.optimize.CommonsChunkPlugin(
            "vendor",   // chunkName
            "vendor.bundle.js",  // filename
            function (module, count) {    // include all modules not in 'appPath' folder in the vendor bundle
                return (module.resource && module.resource.indexOf(appPath) === -1);;
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
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
            },
            { test: /.gif$/, loader: "url-loader?mimetype=image/png" },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    resolve: {
        // you can now require('file') instead of require('file.js')
        extensions: ['', '.js', '.jsx']
    }
};


module.exports = config;