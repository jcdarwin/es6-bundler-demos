# ES6 Bundler Demos

This is a demonstration of different techniques of transpiling and bundling JavaScript
ES6 modules such that they work in the browser.

Our focus is on the different ways of bundling ES6 modules for use in the browser,
rather than on build tools in general, and for this reason we eschew here tools
such as WebPack, Gulp, Grunt etc.

For our examples, we compile a very simple React application that loads another
file (`Hello.js`) as an ES6 module.


## browserify-babelify

This approach uses the [browserify](http://browserify.org/) with the [babelify transform](https://github.com/babel/babelify).

### Installation

	cd browserify-babelify

	npm install

### Building

Running the following will build the application, and open a browser tab showing
the results

	npm run build


## jspm-systemjs-babel

Based on https://github.com/guybedford/jspm-react-component-demo.git

Read the notes at http://jspm.io/0.17-beta-guide/index.html


### Installation

	 npm install --save-dev jspm@beta

	 ./node_modules/.bin/jspm init

	 ./node_modules/.bin/jspm install


### Building

**Building by including React in our bundle:**

	./node_modules/.bin/jspm bundle test.js app-bundle.js --minify

**Building by excluding React, as we'll serve it from a CDN:**

	./node_modules/.bin/jspm bundle test.js - react - react-dom  app-bundle.js

Include the CDN paths in `jspm.browser.js`:

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

	./node_modules/.bin/jspm build jspm-react-component - react dist/jspm-react-component.js --format umd --global-name jspmReactComponent --global-deps "{'react':'React'}" --skip-source-maps
