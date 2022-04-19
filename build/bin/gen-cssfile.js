const path = require('path')
const fs = require('fs')
const Components = require('../../components.json')

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch (e) {
    return false
  }
}

let content = ''

for (const key of Object.keys(Components)) {
  const fileName = `${key}.scss`
  content += `@import './${key}';\n`
  const filePath = path.join(__dirname, '../../packages/theme-chalk/src', fileName)
  if (!fileExists(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8')
    console.log(`theme-chalk 创建遗漏的 ${fileName} 文件`)
  }
}

fs.writeFileSync(path.join(__dirname, '../../packages/theme-chalk/src/index.scss'), content, 'utf8')
