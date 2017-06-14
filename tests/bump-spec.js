/**
 * Tests to exercise applying specific scoped bumping using versiony,
 * applying patch, minor, or major bumps
 */

'use strict'
const versiony = require('../index')

// TODO: replace this with destructuring when we support only node>=6 (@job13er 2017-06-14)
const utils = require('./utils')
const createFileWithVersion = utils.createFileWithVersion
const deleteFile = utils.deleteFile
const getVersion = utils.getVersion
const itShouldBecome = utils.itShouldBecome

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
    describe('when calling .patch()', function () {
      beforeEach(function () {
        v.patch()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.2.4')
    })

    describe('when calling .patch(7)', function () {
      beforeEach(function () {
        v.patch(7)
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '1.2.7')
    })
  })

  describe('.minor()', function () {
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

  describe('when calling .newMinor()', function () {
    beforeEach(function () {
      v.newMinor()
      return getVersion(ctx)
    })

    itShouldBecome(ctx, '1.3.0')
  })

  describe('.major()', function () {
    describe('when calling .major()', function () {
      beforeEach(function () {
        v.major()
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '2.2.3')
    })

    describe('when calling .major(6)', function () {
      beforeEach(function () {
        v.major(6)
        return getVersion(ctx)
      })

      itShouldBecome(ctx, '6.2.3')
    })
  })

  describe('when calling .newMajor()', function () {
    beforeEach(function () {
      v.newMajor()
      return getVersion(ctx)
    })

    itShouldBecome(ctx, '2.0.0')
  })
})
