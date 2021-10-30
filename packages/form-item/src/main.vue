<template>
  <form
    class="y-form-item"
    :class="{
      'y-form-item--feedback': !!yForm && !!yForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': yForm && yForm.hideRequiredAsterisk,
      [`y-form-item--${sizeClass}`]: sizeClass
    }"
  >
    <label-wrap :is-auto-width="styleLabel && styleLabel.width === 'auto'" :update-all="form.labelWidth === 'auto'">
      <label v-if="label || $slots.label" :for="labelFor" class="y-form-item__label" :style="styleLabel">
        <slot name="label">{{ label + form.labelSuffix }}</slot>
      </label>
    </label-wrap>
    <div class="y-form-item__content" :style="styleContent">
      <slot />
      <transition name="y-zoom-in-top">
        <slot v-if="validateState === 'error' && showMessage && form.showMessage" :error="validateMessage" name="error">
          <div
            class="y-form-item__error"
            :class="{
              'y-form-item__error--inline':
                typeof inlineMessage === 'boolean' ? inlineMessage : yForm && !!yForm.inlineMessage
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </form>
</template>

<script>
import AsyncValidator from 'async-validator'
import emitter from 'main/mixins/emitter'
import { noop, getPropByPath } from 'main/utils/util'
import LabelWrap from './label-wrap'

export default {
  name: 'YFormItem',
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
  components: { LabelWrap },
  data() {
    return {
      validateState: undefined,
      validateMessage: undefined,
      validateDisabled: undefined,
      isNested: undefined,
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
      let finalRules = []
      const { rules, required } = this
      if (rules) {
        finalRules = Array.isArray(rules) ? rules : [rules]
      } else {
        const formRules = this.form.rules
        const { v } = getPropByPath(formRules, this.prop || '')
        v && (finalRules = v)
      }
      const isRequired = finalRules.find((required) => !!required)
      return !isRequired && required ? [{ required }, ...finalRules] : finalRules
    },
    getTriggerRules(_trigger) {
      const rules = this.getRules()
      if (!_trigger) return rules
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
      const rules = this.getTriggerRules(trigger).map((rule) => ({ ...rule }))
      if (!rules.length) {
        callback()
        return true
      }
      this.validateState = 'validating'
      for (const rule of rules) {
        delete rule.trigger
      }
      const descriptor = {
        [this.prop]: rules
      }
      const validator = new AsyncValidator(descriptor)
      const model = {
        [this.prop]: this.fieldValue
      }
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !!errors ? 'error' : 'success'
        this.validateMessage = !!errors ? errors[0].message : ''
        callback(this.validateMessage, invalidFields)
        this.yForm && this.yForm.$emit('validate', this.prop, !errors, this.validateMessage)
      })
    },
    resetField() {
      this.validateState = undefined
      this.validateMessage = undefined
      const { model } = this.form
      if (!model || !this.prop) return
      const path = this.prop.includes(':') ? this.prop.replace(/:/, '.') : this.prop
      const { o, k } = getPropByPath(model, path)
      o[k] = this.initialValue
      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false
      })
      // hack for what?
      this.broadcast('YTimeSelect', 'fieldReset', this.initialValue)
    },
    clearValidate() {
      this.validateState = undefined
      this.validateMessage = undefined
      this.validateDisabled = undefined
    },
    onFieldBlur() {
      this.validate('blur')
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }
      this.validate('change')
    },
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = `${width}px`
    },
    addValidateEvents() {
      const rules = this.getRules()
      if (!!rules.length) {
        this.$on('y.form.blur', this.onFieldBlur)
        this.$on('y.form.change', this.onFieldChange)
      }
    },
    removeValidateEvents() {
      this.$off()
    }
  },
  computed: {
    labelFor() {
      return this.for || this.prop
    },
    styleLabel() {
      const ret = {}
      if (this.form.labelPosition === 'top') return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      labelWidth && (reg.labelWidth = labelWidth)
      return ret
    },
    styleContent() {
      const ret = {}
      if (this.form.labelPosition === 'top' || this.form.inline) return ret
      const label = this.label
      if (!label && !this.labelWidth && this.isNested) return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth
        } else if (this.form.labelWidth === 'auto') {
          ret.marginLeft = this.yForm.autoLabelWidth
        }
      } else {
        ret.marginLeft = labelWidth
      }
      return ret
    },
    // TODO 直接用 yForm 行吗？
    form() {
      let parent = this.$parent
      let parentName = parent.$options.name
      while (parentName !== 'YForm') {
        if (parentName === 'YFormItem') {
          this.isNested = true
        }
        parent = parent.$parent
        parentName = parent.$options.name
      }
      return parent
    },
    fieldValue() {
      const { model } = this.form
      if (!model || !this.prop) return
      const path = this.prop.includes(':') ? this.prop.replace(/:/, '.') : this.prop
      return getPropByPath(model, path).v
    },
    isRequired() {
      const rules = this.getRules()
      return rules.some((rule) => rule.required)
    },
    formItemSize() {
      return this.size || this.yForm.size
    },
    sizeClass() {
      // hack for what?
      return this.formItemSize || (this.$YUI || {}).size
    }
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateState = value ? 'error' : undefined
        this.validateMessage = value
      }
    },
    validateStatus(value) {
      this.validateStatus = value
    }
  },
  mounted() {
    this.dispatch('YForm', 'y.form.addField', this)
    this.initialValue = this.fieldValue
    this.addValidateEvents()
  },
  beforeDestroy() {
    this.dispatch('YForm', 'y.form.removeField', this)
  }
}
</script>
