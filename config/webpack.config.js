const path = require('path');

function resolve(dest) {
  return path.resolve(path.basename(__dirname), '..', dest);
}

const paths = {
  src: resolve('src'),
  dist: resolve('dist'),
  nodeModules: resolve('node_modules'),
}
console.error(paths);

module.exports = {
    // input modules
  entry: resolve('src/main.jsx'),
  // output bundles
  output: {
    filename: 'main.js',
    path: paths.dist
  },

  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    modules: [paths.nodeModules, paths.src],
    // treat .js, .json, .jsx, .. as potenital js modules
    extensions: ['.js', '.json', '.jsx'],
  },
  // webpack plugins
  plugins: [],

  // build plugins
  module: {
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        use: [
          'eslint-loader'
        ],
        include: paths.src,
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // reduce babel loader bloat
            plugins: [
              '@babel/plugin-transform-runtime'
            ],
            // babel presets to enable
            presets: [
              [
                '@babel/preset-env',
                {
                  env: {
                    targets: {
                      browsers: [
                        "last 2 versions"
                      ]
                    }
                  },
                  modules: false
                }
              ],
              '@babel/preset-react',
              '@babel/preset-stage-2'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader',
            options: {
              sourceMap: true,
              // CSS-modules
              // modules: true,
              importLoaders: 1,
              //localIdentName: debug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
              // CSS Nano
              //minimize: !debug
            }
          }
        ]
      }
    ]
  },

  // see https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',
  // configure dev server
  devServer: {
    contentBase: paths.dist,
    historyApiFallback: true, // serve index.html from any sub url
    inline: true,
    port: 5000,
    host: 'localhost', // Change to '0.0.0.0' for external facing server
    // watchContentBase: true,
    public: 'localhost:5000',
    publicPath: '/',
    proxy: [
      {
        context: ["/api", "/oidc"],
        changeOrigin: true,
        headers: {
          'X-Dev-Server-Proxy': 'http://localhost:6543'
        },
        target: 'http://localhost:6543'
      }
    ]
  }
};
