/**
 * Tests to exercise applying specific scoped bumping using versiony,
 * applying patch, minor, or major bumps
 */

const versiony = require('../index')
const {createFileWithVersion, deleteFile, itShouldBecomeWhen} = require('./utils')

describe('starting from 1.2.3', function () {
  const ctx = {}
  let filename, v
  beforeEach(function () {
    ctx.filename = filename = '_package.json'
    return createFileWithVersion(filename, '1.2.3')
      .then(() => {
        ctx.v = v = versiony.from(filename).indent(' '.repeat(2))
      })
  })

  afterEach(function () {
    return deleteFile(filename)
  })

  describe('.patch()', function () {
    itShouldBecomeWhen(ctx, 'calling .patch()', '1.2.4', () => {
      v.patch()
    })

    itShouldBecomeWhen(ctx, 'calling .patch(7)', '1.2.7', () => {
      v.patch(7)
    })
  })

  describe('.minor()', function () {
    itShouldBecomeWhen(ctx, 'calling .minor()', '1.3.3', () => {
      v.minor()
    })

    itShouldBecomeWhen(ctx, 'calling .minor(5)', '1.5.3', () => {
      v.minor(5)
    })
  })

  describe('.newMinor()', function () {
    itShouldBecomeWhen(ctx, 'calling .newMinor()', '1.3.0', () => {
      v.newMinor()
    })
  })

  describe('.major()', function () {
    itShouldBecomeWhen(ctx, 'calling .major()', '2.2.3', () => {
      v.major()
    })

    itShouldBecomeWhen(ctx, 'calling .major(6)', '6.2.3', () => {
      v.major(6)
    })
  })

  describe('.newMajor()', function () {
    itShouldBecomeWhen(ctx, 'calling .newMajor()', '2.0.0', () => {
      v.newMajor()
    })
  })
})
