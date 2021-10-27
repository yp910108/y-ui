<template>
  <div id="app">
    <!-- <main-header /> -->
    <!-- <router-view /> -->
    <!-- {{ inputValue }}
    <y-input v-model="inputValue">
      <template slot="prepend">http://</template>
    </y-input> -->
    <y-form ref="form" :model="{}" />
    <button @click="$refs.form.resetFields()">click</button>
  </div>
</template>

<script>
// import MainHeader from './components/header'

export default {
  name: 'app',
  // components: { MainHeader }
  data() {
    return {
      inputValue: 'sdfs'
    }
  }
}
</script>
