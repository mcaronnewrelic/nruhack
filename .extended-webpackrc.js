module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
          {
            loader: 'url-loader',
            options: { limit: 25000 },
          }
        ],
      },
    ],
  },
};