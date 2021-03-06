import Vue from 'vue'
import hljs from 'highlight.js'
import VueRouter from 'vue-router'
import Yui from 'main'
import routes from './route.config'
import title from './i18n/title'
import entry from './app'

import 'packages/theme-chalk/src/index.scss'
import './demo-styles/index.scss'
import './assets/styles/common.css'
import './assets/styles/fonts/style.css'

Vue.use(VueRouter)

Vue.use(Yui)

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
})

router.afterEach((route) => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
  const data = title[route.meta.lang]
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val]
      return
    }
  }
  document.title = 'Element'
  ga('send', 'event', 'PageView', route.name)
})

new Vue({
  router,
  ...entry
}).$mount('#app')
