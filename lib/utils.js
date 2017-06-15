/**
 * Utility module for working with json files
 */

const fs = require('fs')

module.exports = {

  /**
   * Get the version info out of a json object (or string version)
   * @param {String|Object} json - the source to get the version out of
   * @returns {Number[]} an array of major, minor, patch versions
   */
  getVersion (json) {
    if (typeof json === 'string') {
      json = {version: json}
    }

    const versionArray = json.version.split('.')

    return {
      major: versionArray[0] || 0,
      minor: versionArray[1] || 0,
      patch: versionArray[2] || 0
    }
  },

  /**
   * Read in a JSON file as a pojo
   * @param {String} filename - the name of the file to read
   * @returns {Object} the parsed JSON object
   */
  readJsonFile (filename) {
    return JSON.parse(fs.readFileSync(filename))
  },

  /**
   * Write out JSON data to a file
   * @param {String} filename - the filename to write to
   * @param {String|Object} contents - the JSON contents
   * @param {Number} [indent=2] - the number of spaces to indent
   * @param {Boolean} eofNewline - true to add a newline at the end of the file
   */
  writeJsonFile (filename, contents, indent = 2, eofNewline) {
    if (typeof contents !== 'string') {
      contents = JSON.stringify(contents, null, indent)
    }

    if (eofNewline) {
      contents += '\n'
    }

    fs.writeFileSync(filename, contents)
  }
}
