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
import emitter from 'main/mixins/emitter'
import { noop, getPropByPath } from 'main/utils/util'

export default {
  name: 'YFormItem',
  // componentName: 'YFormItem' // hack for what?
  mixins: [emitter],
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: Boolean,
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: String
  },
  inject: ['yForm'],
  data() {
    return {
      validateState: undefined,
      validateMessage: undefined,
      validateDisabled: false,
      validator: undefined,
      isNested: false,
      computedLabelWidth: undefined
    }
  },
  provide() {
    return {
      yFormItem: this
    }
  },
  methods: {
    getRules() {
      const { rules, required } = this
      if (rules) {
        return required ? [{ required }, ...rules] : rules
      }
      const formRules = this.form.rules
      const { v } = getPropByPath(formRules, this.prop || '')
      if (v) {
        return required ? [{ required }, ...v] : v
      }
      return []
    },
    getFilteredRule(_trigger) {
      const rules = this.getRules()
      return rules.filter(({ trigger }) => {
        if (!trigger) return true
        if (Array.isArray(trigger)) {
          return trigger.includes(_trigger)
        } else {
          return trigger === _trigger
        }
      })
    },
    validate(trigger, callback = noop) {
      this.validateDisabled = false
      const rules = this.getFilteredRule(trigger)
    }
  },
  computed: {
    form() {
      let parent = this.$parent
      let parentName = parent.$options.componentName
      while (parentName !== 'YForm') {
        // hack for what?
        // if (parentName === 'YFormItem') {
        //   this.isNested = true
        // }
        parent = parent.$parent
        parentName = parent.$options.componentName
      }
      return parent
    }
  }
}
</script>
