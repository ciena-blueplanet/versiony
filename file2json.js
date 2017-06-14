var FS = require('fs')

module.exports = function (file) {
  return JSON.parse(FS.readFileSync(file))
}
