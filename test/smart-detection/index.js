const assert = require('assert');
const path = require('path');

const wem = require('require-no-cache')('../../');
const parentPath = path.resolve(__dirname);

module.exports.initialise = () => {
  describe('fake-owned-package-name', () => {
    it('flags as private on default options', () => {
      const packages = wem.getPackages({
        path: parentPath
      });
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as private on author.name', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.name']
      });
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as private on author.email', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.email']
      });
      assert.equal(true, packages[0].isPrivate);
    });

    it('flags as public on an unknown property', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.unknown']
      });
      assert.equal(false, packages[0].isPrivate);
    });

    it('flags as public when disabled', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: false
      });
      assert.equal(false, packages[0].isPrivate);
    });
  });

  describe("fake-public-package-name", () => {
    it('flags as public on default options', () => {
      const packages = wem.getPackages({
        path: parentPath
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on author.name', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.name']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on author.email', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.email']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public on an unknown property', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: ['author.unknown']
      });
      assert.equal(false, packages[1].isPrivate);
    });

    it('flags as public when disabled', () => {
      const packages = wem.getPackages({
        path: parentPath,
        smartDetection: false
      });
      assert.equal(false, packages[1].isPrivate);
    });
  });
};
