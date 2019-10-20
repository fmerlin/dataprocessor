var path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js' // this is the compiled final javascript file which we will include in the index.html
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            use: [
                {
                    loader: "html-loader"
                }
            ]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        }]
    },
    devtool: 'cheap-module-eval-source-map', // this helps to browser to point to the exact file in the console, helps in debug
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true // this prevents the default browser full page refresh on form submission and link change
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ]
};