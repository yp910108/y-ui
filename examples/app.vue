<template>
  <div id="app">
    {{ value }}
    <y-progress type="circle" :percentage="50" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      value: undefined
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
