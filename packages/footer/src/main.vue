<template>
  <footer class="y-footer" :style="{ height }">
    <slot />
  </footer>
</template>

<script>
export default {
  name: 'YFooter',
  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
}
</script>
