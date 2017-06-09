/**
 * Tests to exercise applying specific scoped bumping using versiony,
 * applying patch, minor, or major bumps
 */

const utils = require('./utils')

utils.testBump('1.2.3', 'patch', '1.2.4')
utils.testBump('1.2.3', 'minor', '1.3.0')
utils.testBump('1.2.3', 'major', '2.0.0')
