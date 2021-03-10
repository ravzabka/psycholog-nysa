let webpack      = require('webpack');
let path         = require('path');

let settings = {
  context: path.join(__dirname, 'src'),
  entry: [
    '.' + path.sep + 'script.js'
  ],

  output: {
    path: path.join(__dirname, 'web'),
    filename: 'bundle.js'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                'babel-preset-latest',
                'babel-preset-react',
            ]
          }
        }
      }
    ]
  },

  plugins: []
};

// Uncomment code below if you want to use hot loader
// settings.entry.push('webpack/hot/dev-server', 'webpack-hot-middleware/client');
// settings.plugins.push([
//   new webpack.HotModuleReplacementPlugin(),
// ]);

// Bundle will be optimized when run with --production flag.
// This is useful for running it as a task in the task runner.
if (process.argv.indexOf('--production') >= 0) {
  settings.plugins = settings.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]);
}

module.exports = settings;
