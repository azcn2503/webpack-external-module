#Webpack External Module Plugin

A handy way to create a vendor bundle for your Webpack build process.

Webpack does not know about what is "external" and what is "private", so we need to tell it.

How to use:

Require it in your `webpack.config.js`
```js
var webpackExternalModule = require("webpack-external-module");
```

Then configure your commons chunk plugin like this:

###Make all modules external
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

###Make all modules external, except when the module name matches an expression
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

###Use smart detection to detect external modules
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
If the module contains a `package.json` where the `author.name` is the same as the app being built by Webpack, it will be flagged as a private package and not included in the bundle.

Note that `smartDetection` defaults to `["author.name", "author.email"]`, and will flag a module as private if any of the conditions pass.
