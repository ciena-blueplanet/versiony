
var hasMajorMinorPatch = require('./hasMajorMinorPatch')
var hasVersion = require('./hasVersion')

function getVersion (json) {
  if (typeof json === 'string') {
    json = {version: json}
  }
  var v

  if (hasMajorMinorPatch(json)) {
    v = [
      json.major,
      json.minor,
      json.patch
    ]
  } else if (hasVersion(json)) {
    v = json.version.split('.')

    v.length < 1 && (v[0] = 0)
    v.length < 2 && (v[1] = 0)
    v.length < 3 && (v[2] = 0)

    v.length = 3
  }

  return v
}

module.exports = getVersion
