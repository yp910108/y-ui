<template>
  <div id="app">
    {{ value }}
    <!-- <y-date-picker v-model="value" type="week" placeholder="选择日期" format="yyyy年WW周" /> -->
    <!-- <y-time-select
      v-model="value"
      :picker-options="{
        start: '08:30',
        step: '00:15',
        end: '18:30'
      }"
      placeholder="选择时间"
    /> -->
    <y-time-picker
      v-model="value"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围"
    />
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
