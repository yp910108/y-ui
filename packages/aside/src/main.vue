<template>
  <header class="y-aside" :style="{ width }">
    <slot />
  </header>
</template>

<script>
export default {
  name: 'YAside',
  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
}
</script>
