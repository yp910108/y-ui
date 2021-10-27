<template>
  <i :class="`el-icon-${name}`" />
</template>

<script>
export default {
  name: 'YIcon',
  props: {
    name: String
  }
}
</script>
