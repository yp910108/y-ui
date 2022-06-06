/**
 * entry: examples/pages/template/${page}
 * output: examples/pages/${lang}/${page}
 */
const path = require('path')
const fs = require('fs')
const langConfig = require('../../examples/i18n/page.json')

for (const { lang, pages } of langConfig) {
  const langPath = path.join(__dirname, `../../examples/pages/${lang}`)
  if (!fs.existsSync(langPath)) {
    fs.mkdirSync(langPath)
  }
  for (const page of Object.keys(pages)) {
    const templatePath = path.join(__dirname, `../../examples/pages/template/${page}.tpl`)
    const outputPath = path.join(__dirname, `../../examples/pages/${lang}/${page}.vue`)
    let content = fs.readFileSync(templatePath, 'utf8')
    const pairs = pages[page]
    for (const key of Object.keys(pairs)) {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), pairs[key])
    }
    fs.writeFileSync(outputPath, content, 'utf8')
  }
}
