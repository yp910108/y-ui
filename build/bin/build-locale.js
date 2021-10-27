const path = require('path')
const fs = require('fs')
const save = require('file-save')
const localePath = path.join(__dirname, '../../src/locale/lang')
const fileList = fs.readdirSync(localePath)

function transform(filename, name, cb) {
  console.log(name)
  require('babel-core').transformFile(
    path.join(localePath, filename),
    {
      plugins: ['add-module-exports', ['transform-es2015-modules-umd', { loose: true }]],
      moduleId: name
    },
    cb
  )
}

for (const file of fileList) {
  const name = path.basename(file, '.js')
  transform(file, name, (err, { code }) => {
    if (err) {
      console.log(err)
    } else {
      code = code
        .replace(`define('`, `define('y-ui/locale/`)
        .replace('global.', 'global.YUI.lang = global.YUI.lang || {};\n    global.YUI.lang.')
      save(path.join(__dirname, '../../lib/umd/locale', file)).write(code)
      console.log(file)
    }
  })
}
