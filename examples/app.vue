<template>
  <div id="app">
    <y-button type="primary" @click="handleClick">新 增</y-button>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    handleClick() {
      console.log(123)
    }
  }
}
</script>
