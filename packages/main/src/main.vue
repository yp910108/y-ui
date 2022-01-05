<template>
  <header class="y-main">
    <slot />
  </header>
</template>

<script>
export default {
  name: 'YMain',
  props: {
    direction: String
  }
}
</script>
