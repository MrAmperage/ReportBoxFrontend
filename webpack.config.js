module.exports = {
  resolve: {
    fallback: {
      crypto: false,
    },
    extensions: ['.js', '.jsx'],
  },
  mode: 'production',
  entry: './src/Components/App.jsx',
  output: {
    path: '/opt/Projects/ReportBoxRouterService/Static/Js',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            },
          },
        ],
      },
    ],
  },
};
