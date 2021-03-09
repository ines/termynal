const path = require('path');

module.exports = {
  entry: './src/termynal.js',
  output: {
    filename: 'termynal.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Termynal',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
