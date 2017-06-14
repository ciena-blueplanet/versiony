var FS = require('fs')

module.exports = function (file, contents, indent, eofNewline) {
  var data

  if (indent === null) {
    indent = '    '
  }

  if (typeof contents !== 'string') {
    contents = JSON.stringify(contents, null, indent)
  }

  if (eofNewline) {
    contents += '\n'
  }

  FS.writeFileSync(file, contents)

  return data
}
