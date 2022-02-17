<template>
  <div id="app">
    {{ value }}
    <y-tooltip :value="true" content="Top center" placement="top" manual>
      <y-button>Dark</y-button>
    </y-tooltip>
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
