var versiony = require('./index')

versiony
  .from('package.json')
  .major()
  .to('package.json')

var r = versiony.get()

console.log(r)
