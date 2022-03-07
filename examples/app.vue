<template>
  <div id="app">
    {{ value }}
    <y-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card">
      <i class="y-icon-plus" />
    </y-upload>
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
