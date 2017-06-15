/**
 * Specify behavior for the .minor() API interface
 */

const versiony = require('../lib/index')
const {createFileWithVersion, deleteFile, getVersion, itShouldBecome} = require('./utils')

describe('.minor()', function () {
  describe('starting from 1.2.3', function () {
    const ctx = {}
    let filename, v
    beforeEach(function () {
      ctx.filename = filename = '_package.json'
      return createFileWithVersion(filename, '1.2.3')
        .then(() => {
          ctx.v = v = versiony.from(filename)
        })
    })

    afterEach(function () {
      return deleteFile(filename)
    })

    describe('when calling .minor()', function () {
      beforeEach(function () {
        v.minor()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.3.3')
    })

    describe('when calling .minor(5)', function () {
      beforeEach(function () {
        v.minor(5)
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.5.3')
    })
  })

  describe('starting from 1.2.3-alpha.4', function () {
    const ctx = {}
    let filename, v
    beforeEach(function () {
      ctx.filename = filename = '_package.json'
      return createFileWithVersion(filename, '1.2.3-alpha.4')
        .then(() => {
          ctx.v = v = versiony.from(filename).indent(' '.repeat(2))
        })
    })

    afterEach(function () {
      return deleteFile(filename)
    })

    describe('when calling .minor()', function () {
      beforeEach(function () {
        v.minor()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.3.3-alpha.4')
    })

    describe('when calling .minor(5)', function () {
      beforeEach(function () {
        v.minor(5)
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.5.3-alpha.4')
    })
  })
})
