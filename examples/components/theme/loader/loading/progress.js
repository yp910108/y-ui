import Vue from 'vue'
import ProgressBar from './progress'

Vue.prototype.$bar = new Vue(ProgressBar).$mount()

document.body.appendChild(Vue.prototype.$bar.$el)
