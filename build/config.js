const path = require('path')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const Components = require('../components.json')

const utilList = fs.readdirSync(path.join(__dirname, '../src/utils'))
const mixinList = fs.readdirSync(path.join(__dirname, '../src/mixins'))
const transitionList = fs.readdirSync(path.join(__dirname, '../src/transitions'))

const externals = {}

for (const key of Object.keys(Components)) {
  externals[`packages/${key}`] = `y-ui/lib/${key}`
}

externals['main/locale'] = 'y-ui/lib/locale'

for (const file of utilList) {
  const basename = path.basename(file, '.js')
  externals[`main/utils/${basename}`] = `y-ui/lib/utils/${basename}`
}
for (const file of mixinList) {
  const basename = path.basename(file, '.js')
  externals[`main/mixins/${basename}`] = `y-ui/lib/mixins/${basename}`
}
for (const file of transitionList) {
  const basename = path.basename(file, '.js')
  externals[`main/transitions/${basename}`] = `y-ui/lib/transitions/${basename}`
}

exports.externals = [
  {
    // vue: 'vue', // 多余
    ...externals
  },
  nodeExternals()
]

exports.alias = {
  'y-ui': path.join(__dirname, '../'),
  main: path.join(__dirname, '../src'),
  packages: path.join(__dirname, '../packages'),
  examples: path.join(__dirname, '../examples')
}

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
}

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/
