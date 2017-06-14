'use strict'

function join (arr) {
  if (Array.isArray(arr)) {
    arr = arr.join('.')
  }

  return arr || ''
}

var indexes = {
  major: 0,
  minor: 1,
  patch: 2
}

var reset = function () {
  this.major = this.minor = this.patch = undefined
}

module.exports = function () {
  var increments = {
    major: null,
    minor: null,
    patch: null,
    reset: reset
  }

  var parts = {
    major: null,
    minor: null,
    patch: null,
    reset: reset
  }

  var shouldSet = function (name, v) {
    if (v != null) {
      parts[name] = v
      increments[name] = undefined
    } else {
      increments[name] = true
      parts[name] = undefined
    }
  }

  var prepareValue = function (name, array) {
    var index = indexes[name]

    if (increments[name]) {
      array[index]++
    }
    if (parts[name] != null) {
      array[index] = parts[name]
    }
  }

  var files = []

  var model = {
    v: [],
    parts: parts,
    increments: increments,
    reset: function () {
      files.length = 0
      this.v.length = 0

      parts.reset()
      increments.reset()
    },

    major: function (v) {
      shouldSet('major', v)
    },

    minor: function (v) {
      shouldSet('minor', v)
    },

    patch: function (v) {
      shouldSet('patch', v)
    },

    toString: function () {
      return join(this.v)
    },

    file: function (f) {
      if (!this.hasFile(f)) {
        files.push(f)
        return true
      }
    },

    hasFile: function (f) {
      return !!~files.indexOf(f)
    },

    files: function () {
      return files
    },

    set: function (value) {
      value = join(value).split('.')
      value.length = 3

      !value[0] && (value[0] = 0)
      !value[1] && (value[1] = 0)
      !value[2] && (value[2] = 0)

      parts.reset()

      this.v = value
    },

    get: function () {
      var value = this.v.slice()

      !value[0] && (value[0] = 0)
      !value[1] && (value[1] = 0)
      !value[2] && (value[2] = 0)

      prepareValue('major', value)
      prepareValue('minor', value)
      prepareValue('patch', value)

      var result = value.map(function (v) {
        return parseInt(v, 10)
      })

      result.toString = function () {
        return join(this)
      }

      return result
    }
  }

  return model
}
