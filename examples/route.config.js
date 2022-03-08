import navConfig from './nav.config'

const LOAD_MAP = {
  'zh-CN': (name) => {
    return (r) => require.ensure([], () => r(require(`./pages/zh-CN/${name}.vue`)))
  },
  'en-US': (name) => {
    return (r) => require.ensure([], () => r(require(`./pages/en-US/${name}.vue`)))
  },
  es: (name) => {
    return (r) => require.ensure([], () => r(require(`./pages/es/${name}.vue`)))
  },
  'fr-FR': (name) => {
    return (r) => require.ensure([], () => r(require(`./pages/fr-FR/${name}.vue`)))
  }
}

const load = function (lang, path) {
  return LOAD_MAP[lang](path)
}

const LOAD_DOCS_MAP = {
  'zh-CN': (path) => {
    return (r) => require.ensure([], () => r(require(`./docs/zh-CN${path}.md`)))
  },
  'en-US': (path) => {
    return (r) => require.ensure([], () => r(require(`./docs/en-US${path}.md`)))
  },
  es: (path) => {
    return (r) => require.ensure([], () => r(require(`./docs/es${path}.md`)))
  },
  'fr-FR': (path) => {
    return (r) => require.ensure([], () => r(require(`./docs/fr-FR${path}.md`)))
  }
}

const loadDocs = function (lang, path) {
  return LOAD_DOCS_MAP[lang](path)
}

const generateMiscRoutes = function (lang) {
  const indexRoute = {
    path: `/${lang}`,
    meta: { lang },
    name: `home${lang}`,
    component: load(lang, 'index')
  }
  const guideRoute = {
    path: `/${lang}/guide`, // 指南
    redirect: `/${lang}/guide/design`,
    component: load(lang, 'guide'),
    children: [
      {
        path: 'design', // 设计原则
        name: 'guide-design' + lang,
        meta: { lang },
        component: load(lang, 'design')
      },
      {
        path: 'nav', // 导航
        name: 'guide-nav' + lang,
        meta: { lang },
        component: load(lang, 'nav')
      }
    ]
  }
  const themeRoute = {
    path: `/${lang}/theme`,
    component: load(lang, 'theme-nav'),
    children: [
      {
        path: '/', // 主题管理
        name: 'theme' + lang,
        meta: { lang },
        component: load(lang, 'theme')
      },
      {
        path: 'preview', // 主题预览编辑
        name: 'theme-preview-' + lang,
        meta: { lang },
        component: load(lang, 'theme-preview')
      }
    ]
  }
  const resourceRoute = {
    path: `/${lang}/resource`, // 资源
    meta: { lang },
    name: 'resource' + lang,
    component: load(lang, 'resource')
  }
  return [indexRoute, guideRoute, themeRoute, resourceRoute]
}

const registerRoute = (navConfig) => {
  const routes = []
  const addRoute = (page, lang, children) => {
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
    children.push(child)
  }
  for (const lang of Object.keys(navConfig)) {
    routes.push(...generateMiscRoutes(lang))
    const navs = navConfig[lang]
    const route = {
      path: `/${lang}/component`,
      redirect: `/${lang}/component/installation`,
      component: load(lang, 'component'),
      children: []
    }
    routes.push(route)
    for (const nav of navs) {
      if (nav.href) continue
      if (nav.groups) {
        for (const group of nav.groups) {
          for (const nav of group.list) {
            addRoute(nav, lang, route.children)
          }
        }
      } else if (nav.children) {
        for (const n of nav.children) {
          addRoute(n, lang, route.children)
        }
      } else {
        addRoute(nav, lang, route.children)
      }
    }
  }
  return routes
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

const routes = [
  {
    path: '/',
    redirect: defaultPath
  },
  ...registerRoute(navConfig),
  {
    path: '*',
    redirect: defaultPath
  }
]

export default routes
