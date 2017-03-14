# Webpack External Module Plugin

[![Build Status](https://travis-ci.org/azcn2503/webpack-external-module.svg?branch=master)](https://travis-ci.org/azcn2503/webpack-external-module)

A handy way to create a vendor bundle for your Webpack build process.

Webpack does not know about what is "external" and what is "private", so we need to tell it.

It is easy enough using CommonsChunkPlugin to split your bundle so that everything inside `node_modules` becomes an external bundle (typically a vendor bundle); but sometimes you want to keep some of those modules inside your application bundle for whatever reason (you own it, for example).

How to use:

Require it in your `webpack.config.js`
```js
var webpackExternalModule = require("webpack-external-module");
```

Then configure your commons chunk plugin like this:

### Make all modules external
```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule.isExternal(module, {
      smartDetection: false
    });
  }
})
```
This will split every module inside your `node_modules` directory in to a `vendor-bundle.js` output file.

### Make all modules external, except when the module path matches an expression
```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule.isExternal(module, {
      privatePattern: /node_modules\/(package1|package2)\//
    });
  }
})
```
This will split every module excluding those matching the `privatePattern` rule in to a bundle. This is a great way to keep your own modules in your non-vendor bundles. `privatePattern` is tested against the full path of the module.

### Make all modules external, except when the package name or version match an expression
```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule.isExternal(module, {
      privatePattern: {
        name: /mycompany/,
        version: /mycompany/ // if your package version is a GitHub url, this works quite well!
      }
    });
  }
})
```

### Use smart detection to detect external modules
```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule.isExternal(module, {
      smartDetection: ["author.name"]
    });
  }
})
```
Smart detection will load each modules `package.json` and compare the specified properties to see if they match the parent modules `package.json` file. So if you are building the application with an author name of Joe Bloggs, and a module also contains an author name of Joe Bloggs, then the module will be excluded from bundling (and therefore retained for another bundle, typically your application bundle).

Note that `smartDetection` defaults to `["author.name", "author.email"]`, and will flag a module as private if any of the conditions pass.
