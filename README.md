# ES6 Bundler Demos

This is a demonstration of different techniques of transpiling and bundling JavaScript
ES6 modules such that they work in the browser.

Our focus is on the different ways of bundling ES6 modules for use in the browser,
rather than on build tools in general, and for this reason we eschew here tools
such as WebPack, Gulp, Grunt etc.

For our examples, we compile a very simple React application that loads another
file (`Hello.js`) as an ES6 module.

## Goals

We are trying to accomplish the following, in order to make this a realistic appraisal:

* use JSX in our custom React components, meaning the build system needs to be able to compile
JSX to regular JavaScript

* produce a `bundle.js` file containing all of our custom modules

* third party dependencies (such as React) should not be included in our application bundle,
as we may want to include them from a CDN

* We want a dev build (`npm run dev`) that doesn't uglify our code

* we want a production build (`npm run prod`) that does uglify our code

* we want all files (with the exception of third-party JavaScript, which may live on a CDN) that are
to be served to be compiled into a `build` folder.

All techniques listed below work with [Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/): Babel 6 introduced a new plugin architecture which is great, but also broke the previous API. Coupled with this, the `browser.js` file was deprecated, meaning that we need to find another way to load ES6 modules in our browser.

## Approaches

The three approaches we'll be considering here are:

1. browserify-babelify: browserify with the babelify and uglifyify transforms

2. jspm-systemjs-babel: jspm, systemJS and the es6-module-loader, making use of Babel and Rollup

3. webpack-babel: webpack with the babel-loader and uglifyJS plugin.

## Overall conclusion

browserify-babelify is easy to setup, and jspm-systemjs-babel may have plenty of configuration options,
but it does mean we need to load three extra JavaScript files:

* the `system.js` module loader (circa 56KB, not gzipped)

* the `jspm.browser.js` for providing configuration for our browser (circa 1KB, not gzipped)

* the jspm.config.js for providing configuration for the system.js module loader (circa 6KB, not gzipped)

All in all, webpack is the easiest of the approaches to configure, and provides a great deal of control,
including chunking (whereby only the code that is needed for a page is loaded) and hot loading.


===

## 1. browserify-babelify

This approach uses the [browserify](http://browserify.org/) with the [babelify transform](https://github.com/babel/babelify)
and the [uglifyify transform](https://www.npmjs.com/package/uglifyify)

We use the [browserify-shim](https://github.com/thlorenz/browserify-shim) to ensure that we don't include our dependencies in our application bundle.

Using the [uglifyify transform](https://www.npmjs.com/package/uglifyify) means we get the chance to minify third-party
code as well as our own custom code.

### Installation

	cd browserify-babelify

	npm install

### Building

Running one of the following will build the application, and open a browser tab at [http://localhost:9000/build/](http://localhost:9000/build/) showing the results:

	// Produce uglified code
	npm run prod

	// Produce unuglified code, so we can see how `bundle.js` is constructed internally
	npm run dev

Our actual build command, using the npm scripts block, is relatively straight-forward:

	NODE_ENV=production browserify -t [ babelify --presets [ es2015 react ] ] -g uglifyify src/js/app.js -o build/js/bundle.js

### Conclusion

We get a `bundle.js` size of 3.2KB, and this approach requires relatively minimal configuration: apart from the build command, we make use of the [browserify-shim](https://github.com/thlorenz/browserify-shim) in `package.json` to exclude React from our `bundle.js`:

    "browserify": {
      "transform": [
        "browserify-shim"
      ]
    },
    "browserify-shim": {
      "react": "global:React",
      "react-dom": "global:ReactDOM"
    },


## 2. jspm-systemjs-babel

This approach uses the [jspm](http://jspm.io/) / [SystemJS](https://github.com/systemjs/systemjs) / [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader) troika that's maintained by Guy Bedford.

These three projects provide a complete solution for package management, module building and ES6 module loading,
and make use of tools such as Babel and Rollup.

With the move to Babel 6, we've based our example on the [jspm-react-component-demo](https://github.com/guybedford/jspm-react-component-demo.git).

This demo demonstrates some of the major features of using JSPM to bundle React components, and is detailed fully by [the jspm 0.17 beta guide](http://jspm.io/0.17-beta-guide/index.html).

### Installation

	 npm install --save-dev jspm@beta

	 ./node_modules/.bin/jspm install

### Building

Running one of the following will build the application, and open a browser tab at [http://localhost:9000/build/](http://localhost:9000/build/) showing the results:

	// Produce uglified code
	npm run prod

	// Produce unuglified code, so we can see how `bundle.js` is constructed internally
	npm run dev

Our actual build command, using the npm scripts block, is relatively straight-forward:

	NODE_ENV=production ./node_modules/.bin/jspm bundle src/js/app.js - react - react-dom  build/bundle.js --minify

However, we need to do extra work in the configuration, for example, if we want SystemJS to handle the
loading of the React scripts from the CDN, by including the CDN paths in `jspm.browser.js`:

	SystemJS.config({
	  baseURL: ".",
	  production: true,
	  paths: {
	    "github:*": "jspm_packages/github/*",
	    "npm:*": "jspm_packages/npm/*",
	    "jspm-react-component/": "src/",
	    "npm:react@0.14.6": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react.min.js",
	    "npm:react-dom@0.14.6": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react-dom.min.js"
	  }
	});

**Static Builds with Rollup Optimization**

We can also build our component as a publishable component:

	./node_modules/.bin/jspm build jspm-react-component - react dist/jspm-react-component.js --format umd --global-name jspmReactComponent --global-deps "{'react':'React'}" --skip-source-maps

### Conclusion

We get a `bundle.js` size of 3.4KB, and although the jspm approach works well, it does mean understanding the many configuration options available, and we do end up have to serve three ancillary files:

* the `system.js` module loader (circa 56KB, not gzipped)

* the `jspm.browser.js` for providing configuration for our browser (circa 1KB, not gzipped)

* the jspm.config.js for providing configuration for the system.js module loader (circa 6KB, not gzipped)


## 3. webpack-babel

This approach uses webpack with babel and uglify.

We split the code out into a `bundle.js` for our application code and a
`vendor.bundle.js` for all dependencies (React etc)

The [webpack-howto](https://github.com/petehunt/webpack-howto) is a good intro to webpack.

### Installation

	cd webpack-babel

	npm install

### Building

Running one of the following will build the application, and open a browser tab at [http://localhost:9000/build/](http://localhost:9000/build/) showing the results:

	// Produce uglified code
	npm run prod

	// Produce unuglified code, so we can see how `bundle.js` is constructed internally
	npm run dev

Our actual build command, using the npm scripts block, is the simplest yet:

	NODE_ENV=production webpack -p

This of course presumes that we've included the correct configuration in our `webpack.config.js`, which is listed below,
and where around half of this file is us being a little tricky with our plugins, wanting a way
of using different plugin configurations for dev and prod, and using the `CommonsChunkPlugin`
to split out our third party modules into a `vendor.bundle.js`.

We could possibly have instead using `externals` to indicate that React was not to be included in our bundle,
but it seems that [this may be slightly complicated](https://github.com/webpack/webpack/issues/1275).

    // webpack.config.js
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

### Conclusion

We get a `bundle.js` size of 1.8KB, which is by far the smallest.

Webpack also has easy to understand configuration, aided by the fact that it is
specified using JavaScript rather than JSON, meaning that we've got more options for tweaking
the configuration to our liking.
