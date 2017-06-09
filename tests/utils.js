/**
 * Utilities to help with testing versiony
 */

const expect = require('chai').expect
const cpExec = require('child_process').exec
const path = require('path')
const Promise = require('promise')
const exec = Promise.denodeify(cpExec)

const versiony = require('../index')

/**
 * Create a full path to the given fixture filename
 * @param {String} filename - the filename of the fixture
 * @returns {String} the full path to the fixture
 */
function getFullPath (filename) {
  return path.join(process.cwd(), 'tests', 'fixtures', filename)
}

/**
 * Create the command we'll pass to exec() to read the current version from a particular config file
 * @param {String} filename - the file to get the version from
 * @returns {String} the command to pass to `exec()`
 */
function createGetVersionCmd (filename) {
  const fullPath = getFullPath(filename)
  return `node -e "console.log(require('${fullPath}').version)"`
}

module.exports = {

  /**
   * Helper for performing repetative tasks in setting up tests
   * Since versiony doesn't let you tell it to be quiet (yet), we need to stub out
   * console.log() but only while _maybeBumpVersion runs, or we won't get mocha output
   * while running our tests
   *
   * @param {String} filename - the name of the file to bump
   * @param {String} scope - the scope to bump ('patch', 'minor', or 'major')
   * @param {String} expectedVersion - the expected version after the bump
   */
  testBump (filename, scope, expectedVersion) {
    describe(`after a ${scope} bump`, function () {
      let newVersion
      beforeEach(function () {
        const fullPath = getFullPath(filename)
        const v = versiony.from(fullPath).indent(' '.repeat(2))
        switch (scope) {
          case 'patch':
            v.patch()
            break

          case 'minor':
            v.minor().patch(0)
            break

          case 'major':
            v.newMajor()
            break
        }

        v.to(fullPath).end()

        const getVersionCmd = createGetVersionCmd(filename)
        return exec(`${getVersionCmd}`)
          .then((stdout) => {
            newVersion = stdout.replace('\n', '')
          })
      })

      it(`should update the version to ${expectedVersion}`, function () {
        expect(newVersion).to.be.equal(expectedVersion)
      })
    })
  }

}
