const fs = require('fs')

module.exports = function (file) {
  return JSON.parse(fs.readFileSync(file))
}
