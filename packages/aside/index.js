import Aside from './src/main'

Aside.install = (Vue) => {
  Vue.component(Aside.name, Aside)
}

export default Aside
