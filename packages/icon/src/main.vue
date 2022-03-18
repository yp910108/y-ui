<template>
  <i :class="`y-icon-${name}`" />
</template>

<script>
export default {
  name: 'YIcon',
  props: {
    name: String
  }
}
</script>
