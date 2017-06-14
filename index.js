'use strict'

var file2json = require('./file2json')
var json2file = require('./json2file')
var hasMajorMinorPatch = require('./hasMajorMinorPatch')
var hasVersion = require('./hasVersion')
var getVersion = require('./getVersion')

function deprecate (feature, version) {
  console.warn(`versiony: DEPRECATED: ${feature} is deprecated and will be removed in ${version}`)
}

var versiony = (function () {
  var source, sourceJson
  var version2json = function (model, json) {
    var value = model.get()

    if (hasMajorMinorPatch(json)) {
      deprecate('the major/minor/patch json interface', '2.0.0')
      json.major = value[0]
      json.minor = value[1]
      json.patch = value[2]
    } else if (hasVersion(json)) {
      json.version = value.join('.')
    }

    return json
  }

  var logStrip = function () {
    console.log('---------------------------------------------')
  }

  var indent = '    '
  var eofNewline = false

  return {
    model: require('./model')(),

    version: function (version) {
      this.model.reset()
      this.model.set(getVersion(version))

      return this
    },

    eofNewline: function (value) {
      eofNewline = value

      return this
    },

    indent: function (newIndent) {
      indent = newIndent

      return this
    },

    newMajor: function () {
      this.major()
      this.minor(0)
      this.patch(0)

      return this
    },

    newMinor: function () {
      return this.minor().patch(0)
    },

    major: function (major) {
      this.model.major.apply(this.model, arguments)
      return this
    },

    minor: function (minor) {
      this.model.minor.apply(this.model, arguments)
      return this
    },

    patch: function (patch) {
      this.model.patch.apply(this.model, arguments)
      return this
    },

    from: function (s) {
      source = s || 'package.json'

      try {
        sourceJson = file2json(source)
      } catch (ex) {
        console.log('Could not read source file "' + source + '"! ')
        console.log(ex)

        return this
      }

      var version = getVersion(sourceJson)

      if (!version) {
        console.warn(
          'Version could not be detected from "' + source + '"! Please either ' +
          'use a "version" key, with a semver string (eg: "1.2.3") or ' +
          'use "major", "minor" and "patch" keys to specify each semver part separately.'
        )
        return this
      }

      this.model.set(version)
      this.initial = String(this.model)

      return this
    },

    'with': function (file) {
      return this.from(file).to()
    },

    to: function (file) { // eslint-disable-line complexity
      if (!file) {
        file = source
      }

      if (file === source && String(this.model.get()) === this.initial) {
        // skip same file, no change detected
        return this
      }

      if (!file) {
        return this
      }

      var json

      try {
        json = file2json(file)
      } catch (ex) {
        console.log('\nNo file found at "' + file + '". Skipping. \n')
        return this
      }

      try {
        if (!this.model.hasFile(file)) {
          this.model.file(file)

          json2file(
            file,
            version2json(this.model, json),
            indent,
            eofNewline
          )
        }
      } catch (ex) {
        console.log('\nCould not write version to "' + file + '". Skipping. \n')
      }

      return this
    },

    getVersion: function () {
      return this.model.get()
    },

    get: function () {
      return String(this.model.get())
    },

    end: function () {
      logStrip()

      var files = this.model.files().slice()
      var version = String(this.model.get())

      if (files.length) {
        console.log('Done. New version: ' + version)
        logStrip()
        console.log('Files updated:\n')
        files.forEach(function (f) {
          console.log(f)
        })
      } else {
        console.log('No file updated.')
      }

      logStrip()
      this.model.reset()
      return {
        version: version,
        files: files
      }
    }
  }
})()

module.exports = versiony
