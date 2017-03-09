Webpack External Module Plugin
===

A handy way to create a vendor bundle for your Webpack build process.

Webpack does not know about what is "external" and what is "private", so we need to tell it.

How to use:

Require it in your `webpack.config.js`
```js
var webpackExternalModule = require("webpack-external-module");
```

Then configure your commons chunk plugin like this:
```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule(module);
  }
})
```
This will split every module inside your `node_modules` directory in to a `vendor-bundle.js` output file.

```js
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "[name]-bundle.js",
  minChunks: function(module) {
    return webpackExternalModule(module, {
      privatePattern: /node_modules\/(mycompanyname|mypackagename)\//
    });
  }
})
```
This will split every module excluding those matching the `privatePattern` rule in to a bundle. This is a great way to keep your own modules in your non-vendor bundles.
