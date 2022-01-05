<template>
  <header class="y-aside" :style="{ width }">
    <slot />
  </header>
</template>

<script>
export default {
  name: 'YAside',
  props: {
    direction: String
  },
  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
}
</script>
