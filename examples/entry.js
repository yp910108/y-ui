import Vue from 'vue'
// import VueRouter from 'vue-router'
import Yui from 'main'
// import routes from './route.config'
import entry from './app'

import 'packages/theme-chalk/src/index.scss'

// Vue.use(VueRouter)
Vue.use(Yui, { size: 'small' })

// const router = new VueRouter({
//   mode: 'hash',
//   base: __dirname,
//   routes
// })

new Vue({
  // router,
  ...entry
}).$mount('#app')
