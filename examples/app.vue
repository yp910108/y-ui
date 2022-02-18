<template>
  <div id="app">
    {{ value }}
    <y-slider v-model="value" />
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
