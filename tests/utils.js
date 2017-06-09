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
  return path.join(process.cwd(), filename)
}

/**
 * Create the command we'll pass to exec() to read the current version from a particular config file
 * @param {String} filename - the filename to get the version from
 * @returns {String} the command to pass to `exec()`
 */
function createGetVersionCmd (filename) {
  const fullPath = getFullPath(filename)
  return `node -e "console.log(require('${fullPath}').version)"`
}

module.exports = {

  /**
   * Helper for performing repetative tasks in setting up tests
   *
   * @param {String} version - the starting version
   * @param {String} scope - the scope to bump ('patch', 'minor', or 'major')
   * @param {String} expectedVersion - the expected version after the bump
   */
  testBump (version, scope, expectedVersion) {
    describe(`when starting from ${version}`, function () {
      let getVersionCmd, fullPath
      beforeEach(function () {
        fullPath = getFullPath('_package.json')
        getVersionCmd = createGetVersionCmd('_package.json')
        return exec(`echo '{"version": "${version}"}' > ${fullPath}`)
      })

      afterEach(function () {
        return exec(`rm -rf ${fullPath}`)
      })

      it(`should start at ${version}`, function (done) {
        // This is to make sure the .version() command is working, and to ensure a good state for the
        // other bump tests (@job13er 2017-06-09)
        exec(getVersionCmd)
          .then((stdout) => {
            const startingVersion = stdout.replace('\n', '')
            expect(startingVersion).to.equal(version)
            done()
          })
      })

      describe(`after a ${scope} bump`, function () {
        let newVersion
        beforeEach(function () {
          const v = versiony.from('_package.json').indent(' '.repeat(2))
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

          v.to('_package.json').end()

          return exec(getVersionCmd)
            .then((stdout) => {
              newVersion = stdout.replace('\n', '')
            })
        })

        it(`should update the version to ${expectedVersion}`, function () {
          expect(newVersion).to.be.equal(expectedVersion)
        })
      })
    })
  }
}
