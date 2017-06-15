/**
 * Specify behavior for the .from() API interface
 */

const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')

chai.use(sinonChai)
const expect = chai.expect

const versiony = require('../lib/index')
const utils = require('../lib/utils')
const logger = require('../lib/logger')

describe('.from()', function () {
  let sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(utils, 'readJsonFile')
    sandbox.stub(utils, 'writeJsonFile')
    sandbox.stub(versiony.model, 'set')
  })

  afterEach(function () {
    sandbox.restore()
    versiony.model.reset()
  })

  describe('when source file is valid', function () {
    beforeEach(function () {
      utils.readJsonFile.returns({version: '1.2.3-alpha.1'})
    })

    describe('when no filename given', function () {
      beforeEach(function () {
        versiony.from()
      })

      it('should try to read "package.json"', function () {
        expect(utils.readJsonFile).to.have.been.calledWith('package.json')
      })

      it('should set the version on the model', function () {
        expect(versiony.model.set).to.have.been.calledWith({
          major: 1,
          minor: 2,
          patch: 3,
          preRelease: 'alpha.1'
        })
      })

      it('should store the initial version', function () {
        expect(versiony.initial).to.eql({
          major: 1,
          minor: 2,
          patch: 3,
          preRelease: 'alpha.1'
        })
      })
    })

    describe('when a specific filename is given', function () {
      beforeEach(function () {
        versiony.from('_package.json')
      })

      it('should try to read the custom filename', function () {
        expect(utils.readJsonFile).to.have.been.calledWith('_package.json')
      })

      it('should set the version on the model', function () {
        expect(versiony.model.set).to.have.been.calledWith({
          major: 1,
          minor: 2,
          patch: 3,
          preRelease: 'alpha.1'
        })
      })

      it('should store the initial version', function () {
        expect(versiony.initial).to.eql({
          major: 1,
          minor: 2,
          patch: 3,
          preRelease: 'alpha.1'
        })
      })
    })
  })

  describe('when source file is missing version', function () {
    let ret
    beforeEach(function () {
      utils.readJsonFile.returns({})
      sandbox.stub(logger, 'warn')
      ret = versiony.from()
    })

    it('should return itself', function () {
      expect(ret).to.equal(versiony)
    })

    it('should log a warning', function () {
      const msg = 'Version could not be detected from "package.json"! Please use a "version" key with a semver ' +
        'string (eg: "1.2.3")'
      expect(logger.warn).to.have.been.calledWith(msg)
    })

    it('should not set the value', function () {
      expect(versiony.model.set).to.have.callCount(0)
    })
  })

  describe('when reading source file throws an error', function () {
    let ret
    beforeEach(function () {
      utils.readJsonFile.throws({foo: 'bar'})
      sandbox.stub(logger, 'error')
      ret = versiony.from()
    })

    it('should return itself', function () {
      expect(ret).to.equal(versiony)
    })

    it('should log an error', function () {
      const msg = 'Could not read source file "package.json"! '
      expect(logger.error).to.have.been.calledWith(msg)
    })

    it('should log the error that was caught', function () {
      expect(logger.error).to.have.been.calledWith({foo: 'bar'})
    })

    it('should not set the value', function () {
      expect(versiony.model.set).to.have.callCount(0)
    })
  })
})
