const path = require('path');
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/client.js',
  output: {
    path: path.resolve(__dirname, "./public"), // string,
    filename: 'bundle.js'
  },
  module: {
    // loaders: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     loader: 'babel-loader'
    //   },
    //   {
    //       test: /\.scss$/,
    //       exclude: /node_modules/,
    //       loaders: [ 'style', 'css', 'sass' ]
    //   }
    //
    // ],
    rules: [

        {
          test: /\.js$/,
          loader: 'babel-loader',
          //include: paths.src,
          exclude: /node_modules\/(?!autotrack|dom-utils)/,
          // options: {
          //   // This is a feature of `babel-loader` for webpack (not Babel itself).
          //   // It enables caching results in ./node_modules/.cache/babel-loader/
          //   // directory for faster rebuilds.
          //   cacheDirectory: true,
          //   presets: [
          //     ['es2015', { modules: false }],
          //     'stage-2',
          //     'react',
          //     'flow',
          //   ]
          // },
        },
        // {
        //   test: /\.svg$/,
        //   use: [
        //     {
        //       loader: 'babel-loader',
        //       query: {
        //         presets: ['es2015'],
        //       },
        //     },
        //     {
        //       loader: 'react-svg-loader',
        //       query: {
        //         jsx: true,
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              query: {
                sourceMap: true,
                importLoaders: 3,
              },
            },
            // {
            //   loader: 'postcss-loader',
            //   query: {
            //     sourceMap: true,
            //   },
            // },
            // {
            //   loader: 'resolve-url-loader',
            //   query: {
            //     sourceMap: true,
            //   },
            // },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
                sourceMapContents: true,
              },
            },
          ],
        },

        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader'
         ]
       },
    ]
  },

};
