/**
 * Main module for versiony
 */

// NOTE: leaving this namespaced to ease testing (@job13er 2017-06-15)
const utils = require('./utils')

function logStrip () {
  console.log('---------------------------------------------')
}

module.exports = (function () {
  let source, sourceJson
  const version2json = function (model, json) {
    json.version = model.toString()
    return json
  }

  let indent = 2
  let eofNewline = false

  return {
    model: require('./model')(),

    version (version) {
      this.model.reset()
      this.model.set(utils.getVersion(version))
      return this
    },

    eofNewline (value) {
      eofNewline = value
      return this
    },

    indent (newIndent) {
      indent = newIndent
      return this
    },

    newMajor () {
      return this.major().minor(0).patch(0).preRelease('')
    },

    newMinor () {
      return this.minor().patch(0).preRelease('')
    },

    major (value) {
      this.model.major(value)
      return this
    },

    minor (value) {
      this.model.minor(value)
      return this
    },

    patch (value) {
      this.model.patch(value)
      return this
    },

    preRelease (value) {
      this.model.preRelease(value)
      return this
    },

    from (s) {
      source = s || 'package.json'

      try {
        sourceJson = utils.readJsonFile(source)
      } catch (ex) {
        console.log('Could not read source file "' + source + '"! ')
        console.log(ex)

        return this
      }

      const version = utils.getVersion(sourceJson)

      if (!version) {
        console.warn(
          `Version could not be detected from "${source}"! Please ` +
          'use a "version" key with a semver string (eg: "1.2.3")'
        )
        return this
      }

      this.model.set(version)
      this.initial = String(this.model)

      return this
    },

    with (file) {
      return this.from(file).to()
    },

    to (file) { // eslint-disable-line complexity
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

      let json

      try {
        json = utils.readJsonFile(file)
      } catch (ex) {
        console.log('\nNo file found at "' + file + '". Skipping. \n')
        return this
      }

      try {
        if (!this.model.hasFile(file)) {
          this.model.file(file)

          utils.writeJsonFile(
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

    getVersion () {
      return this.model.get()
    },

    get () {
      return String(this.model.get())
    },

    end (params = {}) {
      const {quiet} = params
      const files = this.model.files().slice()
      const version = String(this.model.get())

      if (!quiet) {
        if (files.length) {
          logStrip()
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
      }

      this.model.reset()
      return {
        version: version,
        files: files
      }
    }
  }
})()
