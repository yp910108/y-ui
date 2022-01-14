<template>
  <header class="y-header" :style="{ height }">
    <slot />
  </header>
</template>

<script>
export default {
  name: 'YHeader',
  props: {
    height: {
      type: String,
      default: '60px'
    }
  }
}
</script>
