var path = require('path');
var _ = require('lodash');

var packages = null;
var parentDir = path.dirname(module.parent.filename);

var DEFAULT_OPTIONS = {
  privatePattern: false,
  smartDetection: ['author.name', 'author.email']
};

function getPackages(options) {
  options = _.merge(DEFAULT_OPTIONS, options);
  var packagesJson = require(path.resolve(parentDir, 'package.json'));
  var packages = _.merge(packagesJson.dependencies, packagesJson.devDependencies);
  packages = _.map(packages, function(val, key) {
    return {
      name: key,
      version: val,
      isPrivate: false
    };
  });
  var enrich = false;
  if (options.privatePattern) {
    enrich = true;
  }
  if (options.smartDetection) {
    enrich = true;
    // Map options to objects containing a key (the name of the property we want
    // to check) and a value (a regular expression built from the property
    // value found in the module parent's package.json)
    // Example:
    // ["author.name"]
    // becomes
    // [{ key: "author.name", value: /Joe Bloggs/i }]
    options.smartDetection = _.filter(_.map(options.smartDetection, function(option) {
      if (_.has(packagesJson, option)) {
        return {
          key: option,
          value: new RegExp(_.get(packagesJson, option), 'i')
        };
      } else {
        return null;
      }
    }), function(option) {
      return option !== null;
    });
  }
  if (enrich) {
    // Enrich the packages with an isPrivate flag if necessary
    packages = enrichPrivatePackages(packages, options);
  }
  return packages;
}

function enrichPrivatePackages(packages, options) {
  if (options.smartDetection) {
    // Run smart detection rules on each package and set isPrivate to true if
    // any rules evaluate to true
    _.each(packages, function(package) {
      // Load the package.json for this package
      var packageJson = require(path.resolve(parentDir, 'node_modules', package.name, 'package.json'));
      _.each(options.smartDetection, function(option) {
        if (option.value.test(_.get(packageJson, option.key))) {
          package.isPrivate = true;
        }
      });
    });
  }
  if (options.privatePattern) {
    // Test the package name for the privatePattern and set isPrivate to true if
    // any rules evaluate to true
    _.each(packages, function(package) {
      package.isPrivate = options.privatePattern.test(package.name);
    });
  }
  return packages;
}

function isPrivate(userRequest, options) {
  if (!options.smartDetection && !options.privatePattern) {
    // Don't run any private detection rules if smartDetection or privatePattern
    // are not specified in the options
    return false;
  }
  return _.findIndex(_.values(packages), function(package) {
    if (new RegExp('node_modules\/' + package.name).test(userRequest)) {
      return package.isPrivate;
    }
  }) >= 0;
}

function isExternal(module, options) {
  // Detect if a module is private according to various rules
  var userRequest = module.userRequest;
  if (typeof(userRequest) !== 'string') {
    return false;
  }
  options = _.merge(DEFAULT_OPTIONS, options);
  if (!packages) {
    // Set the global packages if they haven't already been worked out manually
    packages = getPackages(options);
  }
  return /node_modules/.test(userRequest) && !isPrivate(userRequest, options);
}

module.exports = {
  getPackages: getPackages,
  isExternal: isExternal
}
