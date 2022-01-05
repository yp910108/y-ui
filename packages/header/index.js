import Header from './src/main'

Header.install = (Vue) => {
  Vue.component(Header.name, Header)
}

export default Header
