const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const fontFile = fs.readFileSync(path.join(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8')
const nodes = postcss.parse(fontFile).nodes
const classList = []

for (const { selector = '' } of nodes) {
  const reg = /\.y-icon-([^:]+):before/
  const arr = selector.match(reg)
  if (arr && arr[1]) {
    classList.push(arr[1])
  }
}

classList.reverse() // 希望按 css 文件顺序倒序排列

fs.writeFileSync(path.join(__dirname, '../../examples/icon.json'), JSON.stringify(classList))
