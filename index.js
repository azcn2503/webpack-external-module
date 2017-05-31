const path = require('path');
const _ = require('lodash');

const DEFAULT_OPTIONS = {
  privatePattern: false,
  smartDetection: ['author.name', 'author.email'],
  packageJson: null
};

function getPackages(options) {
  var parentDir = options.path || path.dirname(module.parent.filename);
  var packageJson = require(path.resolve(parentDir, 'package.json'));
  options = Object.assign({}, DEFAULT_OPTIONS, options, {
    parentDir: parentDir,
    packageJson: packageJson
  });
  var packages = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);
  packages = _.map(packages, (val, key) => {
    if (typeof(key) === 'string') {
      var packagePath = path.resolve(parentDir, 'node_modules', key);
      return {
        name: key,
        version: val,
        path: packagePath,
        json: require(path.resolve(packagePath, 'package.json')),
        isPrivate: false,
        reasons: []
      };
    }
  });
  packages = enrichPrivatePackages(packages, options);
  return packages;
}

function enrichPrivatePackages(packages, options) {
  if (options.smartDetection) {
    // Map options to objects containing a key (the name of the property we want
    // to check) and a value (a regular expression built from the property
    // value found in the module parent's package.json)
    // Example:
    // ["author.name"]
    // becomes
    // [{ key: "author.name", value: /Joe Bloggs/i }]
    options.smartDetection = _.chain(options.smartDetection)
      .map(option => {
        if (_.has(options.packageJson, option)) {
          return {
            key: option,
            value: new RegExp(_.get(options.packageJson, option), 'i')
          };
        } else {
          return null;
        }
      })
      .filter(option => {
        return option !== null;
      })
      .value();
    _.each(packages, pkg => {
      // Load the package.json for this package
      _.each(options.smartDetection, option => {
        if (option.value.test(_.get(pkg.json, option.key))) {
          makePrivate(pkg, "Matched smartDetection expression on " + option.key + ": " + option.value);
        }
      });
    });
  }
  if (options.privatePattern) {
    _.each(packages, pkg => {
      if (options.privatePattern instanceof RegExp) {
        if (options.privatePattern.test(pkg.path)) {
          makePrivate(pkg, "Matched privatePattern expression on path: " + options.privatePattern);
        }
      } else if (typeof(options.privatePattern) === 'object') {
        _.each(options.privatePattern, (val, key) => {
          if (val.test(pkg[key])) {
            makePrivate(pkg, "Matched privatePattern expression on " + key + ": " + val);
          }
        });
      }
    });
  }
  return packages;
}

function makePrivate(pkg, reason) {
  pkg.isPrivate = true;
  pkg.reasons.push(reason);
}

function isPrivate(userRequest, options) {
  if (!options.smartDetection && !options.privatePattern) {
    // Don't run any private detection rules if smartDetection or privatePattern
    // are not specified in the options
    return false;
  }
  return _.findIndex(_.values(options.packages), pkg => {
    if (new RegExp('node_modules\/' + pkg.name).test(userRequest)) {
      return pkg.isPrivate;
    }
  }) >= 0;
}

function isExternal(module, options) {
  // Detect if a module is private according to various rules
  var userRequest = module.userRequest;
  if (typeof(userRequest) !== 'string') {
    return false;
  }
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  var packages = getPackages(options);
  options.packages = packages;
  return /node_modules/.test(userRequest) && !isPrivate(userRequest, options);
}

module.exports = {
  getPackages,
  isExternal
};
