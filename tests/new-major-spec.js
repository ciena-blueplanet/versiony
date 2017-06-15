/**
 * Specify behavior for the .newMajor() API interface
 */

const versiony = require('../lib/index')
const {createFileWithVersion, deleteFile, getVersion, itShouldBecome} = require('./utils')

describe('.newMajor()', function () {
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

    describe('when calling .newMajor()', function () {
      beforeEach(function () {
        v.newMajor()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '2.0.0')
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

    describe('when calling .newMajor()', function () {
      beforeEach(function () {
        v.newMajor()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '2.0.0')
    })
  })
})
