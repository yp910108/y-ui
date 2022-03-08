<template>
  <div id="app">
    <!-- <main-header /> -->
    <y-dropdown>
      <span class="y-dropdown-link"> 下拉菜单<i class="y-icon-arrow-down y-icon--right" /> </span>
      <y-dropdown-menu slot="dropdown">
        <y-dropdown-item>黄金糕</y-dropdown-item>
        <y-dropdown-item>狮子头</y-dropdown-item>
        <y-dropdown-item>螺蛳粉</y-dropdown-item>
        <y-dropdown-item disabled>双皮奶</y-dropdown-item>
        <y-dropdown-item divided>蚵仔煎</y-dropdown-item>
      </y-dropdown-menu>
    </y-dropdown>
  </div>
</template>

<script>
// import MainHeader from './components/header'

export default {
  name: 'app',
  // components: { MainHeader },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.y-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.y-icon-arrow-down {
  font-size: 12px;
}
</style>
