var versiony = require('./index')

versiony
    .from('package.json')
    .major()
    .to('package.json')

var r = versiony.get()

console.log(r)

var r = versiony
  .version('2.99.99')
  .patch()
  .maxPatch(99)
  .maxMinor(99)
  .end().version

console.log(r)
