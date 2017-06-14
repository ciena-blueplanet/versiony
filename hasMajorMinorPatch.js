module.exports = function (json) {
  return ('major' in json) && ('minor' in json) && ('patch' in json)
}
