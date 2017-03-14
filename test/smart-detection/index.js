var assert = require('assert');

var wem = require('../../');

module.exports.initialise = function() {
  describe('fake-owned-package-name', function() {
    it('flags as private on default options', function() {
      var packages = wem.getPackages();
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as private on author.name', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.name']
      });
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as private on author.email', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.email']
      });
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as public on an unknown property', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.unknown']
      });
      assert.equal(false, packages[0].isPrivate);
    });

    it('flags as public when disabled', function() {
      var packages = wem.getPackages({
        smartDetection: false
      });
      assert.equal(false, packages[0].isPrivate);
    });
  });

  describe("fake-public-package-name", function() {
    it('flags as public on default options', function() {
      var packages = wem.getPackages({});
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on author.name', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.name']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on author.email', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.email']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on an unknown property', function() {
      var packages = wem.getPackages({
        smartDetection: ['author.unknown']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public when disabled', function() {
      var packages = wem.getPackages({
        smartDetection: false
      });
      assert.equal(false, packages[1].isPrivate);
    });
  });
};
