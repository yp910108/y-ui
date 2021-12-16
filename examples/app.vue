<template>
  <div id="app">
    <y-form ref="form" :model="form" :rules="rules" label-width="85px">
      <y-form-item ref="age" prop="name" label="姓名:">
        <y-input v-model.trim="form.name" maxlength="30" />
      </y-form-item>
      <y-form-item prop="sex" label="性别:">
        <y-input v-model.trim="form.sex" maxlength="30" />
      </y-form-item>
      <y-form-item prop="age" label="年龄:">
        <y-input v-model.trim="form.age" maxlength="30" />
      </y-form-item>
      <y-form-item prop="remark" label="备注:">
        <y-input v-model.trim="form.remark" type="textarea" maxlength="300" />
      </y-form-item>
    </y-form>
    <button @click="handleSave">保 存</button>
    <button style="margin-left: 10px" @click="handleReset">重 置</button>
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
