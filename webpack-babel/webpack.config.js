var path = require('path');
var webpack = require('webpack');

// To split out react from our app bundle, we choose here to use the approach
// detailed at: http://stackoverflow.com/a/29087883
// This allows us not to have to list all vendor modules here, as is typical
// with the CommonsChunkPlugin plugin: http://stackoverflow.com/a/30418406
var node_modules_dir = path.join(__dirname, 'node_modules'),
    app_dir          = path.join(__dirname, 'src');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    filename: "vendor.bundle.js",
    minChunks: function (module, count) {
       return module.resource && module.resource.indexOf(app_dir) === -1;
    }
})

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    mangle:   true,
    compress:{
        warnings: false
    }
})

var plugins, devtool;
if (process.env.NODE_ENV === 'production') {
    plugins = [
        commonsPlugin,
        uglifyJsPlugin
   ]
   devtool = 'cheap-module-source-map'
} else {
    plugins = [
        commonsPlugin
   ]
   devtool = 'eval'
}

module.exports = {
  entry: {
    app: './src/js/app.js'
  },
  output: {
    path: path.join(__dirname, 'build/js'),
    filename: 'bundle.js'
  },
  devtool: devtool,
  plugins: plugins,
  module: {
    loaders: [
      {
      	// Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        loader: 'babel-loader',

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "src"),
        ],

        exclude: [
          path.resolve(__dirname, "node_modules"),
        ],
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
