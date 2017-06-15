const {getVersion} = require('./utils')

/**
 * Empty the given array (without overriding the reference to it)
 * @param {*[]} arr - the array to empty
 */
function emptyArray (arr) {
  arr.splice(0, arr.length)
}

module.exports = function () {
  const increments = {
    major: null,
    minor: null,
    patch: null,
    reset () {
      this.major = this.minor = this.patch = null
    }
  }

  const parts = Object.assign({}, increments)

  const shouldSet = function (name, value) {
    if (value !== undefined) {
      parts[name] = value
      increments[name] = null
    } else {
      increments[name] = true
      parts[name] = null
    }
  }

  const prepareValue = function (name, version) {
    if (increments[name]) {
      version[name]++
    }
    if (parts[name] !== null) {
      version[name] = parts[name]
    }
  }

  const files = []

  const model = {
    version: {major: 0, minor: 0, patch: 0},
    parts,
    increments,
    reset () {
      emptyArray(files)
      parts.reset()
      increments.reset()
    },

    major (v) {
      shouldSet('major', v)
    },

    minor (v) {
      shouldSet('minor', v)
    },

    patch (v) {
      shouldSet('patch', v)
    },

    toString () {
      return `${this.version.major}.${this.version.minor}.${this.version.patch}`
    },

    file (f) {
      if (!this.hasFile(f)) {
        files.push(f)
        return true
      }
    },

    hasFile (f) {
      return !!~files.indexOf(f)
    },

    files () {
      return files
    },

    set (value) {
      if (typeof value === 'string') {
        value = getVersion(value)
      }

      parts.reset()

      this.version = value
    },

    get () {
      prepareValue('major', this.version)
      prepareValue('minor', this.version)
      prepareValue('patch', this.version)

      return this.version
    }
  }

  return model
}
