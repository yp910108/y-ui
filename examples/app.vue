<template>
  <div id="app">
    <y-button>click</y-button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      form: {
        name: undefined,
        sex: undefined,
        age: undefined,
        remark: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
        sex: [{ required: true, message: '请输入性别' }],
        age: [{ required: true, message: '请输入年龄' }],
        remark: [{ required: true, message: '请输入备注' }]
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
    handleSave() {
      console.log(this.validate())
    },
    handleReset() {
      this.$refs.age.resetField()
    }
  }
}
</script>
