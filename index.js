var path = require('path');
var _ = require('lodash');
var packages = getParentPackages();

function getParentPackages() {
  var parentDir = path.dirname(module.parent.filename);
  var packagesJson = require(path.resolve(parentDir, 'package.json'));
  var packages = _.merge(packagesJson.dependencies, packagesJson.devDependencies);
  return packages;
}

function isPrivate(userRequest, pattern) {
  return _.findIndex(_.keys(packages), function(key) {
    if (pattern.test(userRequest)) {
    }
    return pattern.test(userRequest);
  }) >= 0;
}

function isExternal(module, options) {
  options = _.merge({
    privatePattern: false
  }, options);
  var userRequest = module.userRequest;
  if (typeof(userRequest) !== 'string') {
    return false;
  }
  return /node_modules/.test(userRequest) && (options.privatePattern ? !isPrivate(userRequest, options.privatePattern) : true);
}

module.exports = isExternal;
