<template>
  <div id="app">
    <y-checkbox-group v-model="checkboxGroup1">
      <y-checkbox v-for="city in cities" :label="city" :key="city" border>{{ city }}</y-checkbox>
    </y-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      checkboxGroup1: ['上海'],
      cities: ['上海', '北京', '广州', '深圳']
    }
  },
  methods: {}
}
</script>
