<template>
  <div id="app">
    {{ value }}
    <y-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      value: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
