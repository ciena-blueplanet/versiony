/**
 * Tests to exercise applying specific scoped bumping using versiony,
 * applying patch, minor, or major bumps
 */

const utils = require('./utils')

describe('1.2.3', function () {
  utils.testBump('_package.json', 'patch', '1.2.4')
  utils.testBump('_package.json', 'minor', '1.3.0')
  utils.testBump('_package.json', 'major', '2.0.0')
})
