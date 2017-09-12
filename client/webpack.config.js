const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const autoprefixer = require('autoprefixer');

const NODE_ENV = process.env.NODE_ENV || 'development';

const autoprefixerOptions = {
  cascade: false,
  browsers: [
    '> 0.1%',
    'last 6 versions',
    'last 6 Android versions',
    'last 6 BlackBerry versions',
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]
};




/*------------------------------------*\
  Base
\*------------------------------------*/
var config = {

  entry: path.join(__dirname, '/src/main.js'),

  module: {

    rules: [

      {
        test : /\.jsx?/,
        include : path.join(__dirname, '/src'),
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ],
      },

      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true,
              attrs: { id: 'style-loader-scss' },
            },
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer(autoprefixerOptions)]
              },
            },
          },
        ],
      },

      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true,
              attrs: { id: 'style-loader-css' },
            },
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer(autoprefixerOptions)]
              },
            },
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|eot|svg|otf|ttf|woff|woff2)(\?\S*)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[hash].[ext]'
            },
          },
        ],
      },

    ],

  },


  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + NODE_ENV + '"',
      }
    }),

  ],


};


/*------------------------------------*\
  Development
\*------------------------------------*/
if (NODE_ENV === 'development') {

  config.output = {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
  };

  config.plugins = (config.plugins || []).concat([

    new HtmlWebpackPlugin({
      title: 'Dev AvsB',
      template: path.join(__dirname, 'src/index.ejs'),
      env: NODE_ENV,
    }),

  ]);

  config.devServer = {
    //contentBase: '/',
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: 80,
    //host: '0.0.0.0',
    overlay: {
      warnings: true,
      errors: true
    },
    open: true,
  };

}






/*------------------------------------*\
  Production
\*------------------------------------*/
if (NODE_ENV === 'production') {

  config.devtool = '#source-map';

  config.output = {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
  },

  config.plugins = (config.plugins || []).concat([

    // using --optimize-minimize instead
    // https://github.com/webpack/docs/wiki/optimization
    //new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  }
    //}),


    // https://github.com/jantimon/html-webpack-plugin#configuration
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.ejs'),
      title: 'AvsB',
      description: '',
      inject: true,
      env: NODE_ENV,
      //hash: true,
      //minify: {
      //    html5: true,
      //},
    }),

    new CopyWebpackPlugin(
      [
        { from: 'src/resources/favicon', to: './assets/favicon', },
      ],
      { copyUnmodified: true, }
    ),

    // cleanups after build
    new WebpackCleanupPlugin({
      preview: false,
    }),

    // uncomment if you want to analyze
    //new BundleAnalyzerPlugin({
    //  analyzerMode: 'static',
    //}),


  ]);

}








module.exports = config;
