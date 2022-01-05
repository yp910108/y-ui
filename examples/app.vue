<template>
  <div id="app">
    <!-- <y-container>
      <y-header>Header</y-header>
      <y-aside width="200px">Aside</y-aside>
      <y-main>Main</y-main>
      <y-footer>Footer</y-footer>
    </y-container> -->

    <y-container>
      <y-header>Header</y-header>
      <y-container>
        <y-aside width="200px">Aside</y-aside>
        <y-container>
          <y-main>Main</y-main>
          <y-footer>Footer</y-footer>
        </y-container>
      </y-container>
    </y-container>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
.y-header,
.y-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.y-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.y-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
