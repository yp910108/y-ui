import navConfig from './nav.config'
import langs from './i18n/route'

const LOAD_MAP = {
  'zh-CN': (name) => {
    return (r) => require.ensure([], () => r(require(`./pages/zh-CN/${name}.vue`)), 'zh-CN')
  }
  // 'en-US': (name) => {
  //   return (r) => require.ensure([], () => r(require(`./pages/en-US/${name}.vue`)), 'en-US')
  // },
  // es: (name) => {
  //   return (r) => require.ensure([], () => r(require(`./pages/es/${name}.vue`)), 'es')
  // },
  // 'fr-FR': (name) => {
  //   return (r) => require.ensure([], () => r(require(`./pages/fr-FR/${name}.vue`)), 'fr-FR')
  // }
}

const load = function (lang, path) {
  return LOAD_MAP[lang](path)
}

// const LOAD_DOCS_MAP = {
//   'zh-CN': (path) => {
//     return (r) => require.ensure([], () => r(require(`./docs/zh-CN${path}.md`)), 'zh-CN')
//   },
//   'en-US': (path) => {
//     return (r) => require.ensure([], () => r(require(`./docs/en-US${path}.md`)), 'en-US')
//   },
//   es: (path) => {
//     return (r) => require.ensure([], () => r(require(`./docs/es${path}.md`)), 'es')
//   },
//   'fr-FR': (path) => {
//     return (r) => require.ensure([], () => r(require(`./docs/fr-FR${path}.md`)), 'fr-FR')
//   }
// }

// const loadDocs = function (lang, path) {
//   return LOAD_DOCS_MAP[lang](path)
// }

const registerRoute = (navConfig) => {
  const routes = []
  for (const [index, lang] of Object.keys(navConfig).entries()) {
    const navs = navConfig[lang]
    routes.push({
      path: `/${lang}/component`,
      redirect: `/${lang}/component/installation`,
      component: load(lang, 'component'),
      children: []
    })
    for (const nav of navs) {
      if (nav.href) return
      if (nav.groups) {
        for (const group of nav.groups) {
          for (const nav of group.list) {
            addRoute(nav, lang, index)
          }
        }
      }
    }
  }
  const addRoute = (page, lang, index) => {
    const component = page.path === '/changelog' ? load(lang, 'changelog') : loadDocs(lang, page.path)
    const child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
        lang
      },
      name: `component-${lang}${page.title || page.name}`,
      component: component.default || component
    }
    routes[index].children.push(child)
  }
  return routes
}

let routes = registerRoute(navConfig)

const generateMiscRoutes = function (lang) {
  const indexRoute = {
    path: `/${lang}`,
    meta: { lang },
    name: `home${lang}`,
    component: load(lang, 'index')
  }
  return [indexRoute]
}

for (const { lang } of langs) {
  routes = [...generateMiscRoutes(lang), ...routes]
}

const userLanguage = localStorage.getItem('YUI_LANGUAGE') || window.navigator.language || 'en-US'
let defaultPath = '/en-US'
if (userLanguage.indexOf('zh-') !== -1) {
  defaultPath = '/zh-CN'
} else if (userLanguage.indexOf('es') !== -1) {
  defaultPath = '/es'
} else if (userLanguage.indexOf('fr') !== -1) {
  defaultPath = '/fr-FR'
}

routes = [
  {
    path: '/',
    redirect: defaultPath
  },
  ...routes,
  {
    path: '*',
    redirect: defaultPath
  }
]

export default routes
