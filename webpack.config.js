//
// webpack.config.js to build an examples bundle
// for use with the examples site. To use this in
// another project you do not have to build anything.
//

module.exports = {
  entry: './examples/modules/main.jsx',
  output: {
    filename: 'examples-bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'jsx-loader?harmony' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};