<template>
  <div id="app">
    <y-form ref="form" :model="form" :rules="rules" label-width="180px">
      <y-form-item prop="val" label="测试:">
        <y-radio-group v-model="form.val">
          <y-radio-button :label="1" />
          <y-radio-button :label="2" />
        </y-radio-group>
      </y-form-item>
    </y-form>
    <y-button @click="handleClick">click</y-button>
    <!-- <input v-model="val" type="radio" :value="1" />
    <input v-model="val" type="radio" :value="2" />
    <input v-model="val" type="radio" :value="3" /> -->
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      form: {
        val: undefined
      },
      rules: {
        val: [{ required: true, message: '请选择' }]
      }
    }
  },
  methods: {
    validate() {
      let pass = false
      this.$refs.form.validate((valid) => {
        pass = valid
      })
      return pass
    },
    handleClick() {
      console.log(this.validate())
    }
  }
}
</script>
