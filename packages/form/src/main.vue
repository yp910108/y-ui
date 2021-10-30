<template>
  <form
    class="y-form"
    :class="{
      [`y-form--label-${labelPosition}`]: labelPosition,
      'y-form--inline': inline
    }"
  >
    <slot />
  </form>
</template>

<script>
import { noop } from 'main/utils/util'

export default {
  name: 'YForm',
  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: String,
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fields: [],
      potentialLabelWidthArr: [] // use this array to calculate auto width
    }
  },
  provide() {
    return {
      yForm: this
    }
  },
  methods: {
    resetFields() {
      if (!this.model) {
        console.warn('[Yui Warn][Form]model is required for resetFields to work.')
        return
      }
      for (const field of this.fields) {
        field.resetField()
      }
    },
    validateField(props, cb) {
      if (!Array.isArray(props)) {
        props = [props]
      }
      const fields = this.fields.filter((field) => props.includes(field.prop))
      if (!fields.length) {
        console.warn('[Yui Warn]please pass correct props!')
        return
      }
      for (const field of fields) {
        field.validate('', cb)
      }
    },
    validate(callback) {
      if (!this.model) {
        console.warn('[Yui Warn][Form]model is required for resetFields to work.')
        return
      }
      let promise
      if (typeof callback !== 'function') {
        promise = new Promise((resolve, reject) => {
          callback = (valid, invalidFields) => {
            valid ? resolve(valid) : reject(invalidFields)
          }
        })
      }
      let valid = true
      let count = 0
      if (!this.fields.length) {
        callback(true)
      }
      let invalidFields = {}
      for (const field of this.fields) {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          invalidFields = { ...invalidFields, field }
          if (++count === this.fields.length) {
            callback(valid, invalidFields)
          }
        })
      }
      if (promise) {
        return promise
      }
    },
    clearValidate(props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter((field) => field.prop === props)
          : this.fields.filter((field) => props.includes(field.prop))
        : this.fields
      for (const field of fields) {
        field.clearValidate()
      }
    },
    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.index(width)
      // it's impossible // hcak for what?
      if (index === -1) {
        throw new Error(`[YuiForm]unexpected width ${width}`)
      }
      return index
    },
    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal)
        this.potentialLabelWidthArr.splice(index, 1, val)
      } else if (val) {
        this.potentialLabelWidthArr.push(val)
      }
    },
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val)
      this.potentialLabelWidthArr.splice(index, 1)
    }
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0
      const max = Math.max(...this.potentialLabelWidthArr, 0)
      return `${max}px`
    }
  },
  watch: {
    rules() {
      for (const field of rules) {
        field.removeValidateEvents()
        field.addValidateEvents()
      }
      if (this.validateOnRuleChange) {
        this.validate(noop)
      }
    }
  },
  created() {
    this.$on('y.form.addField', this.fields.push)
    this.$on('y.form.removeField', (field) => {
      this.fields.splice(this.fields.indexOf(field), 1)
    })
  }
}
</script>
