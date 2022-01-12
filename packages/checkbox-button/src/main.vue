<template>
  <label
    :class="{
      'y-checkbox-button': true,
      [`y-checkbox-button--${sizeClass}`]: sizeClass,
      'is-disabled': isDisabled,
      'is-checked': isChecked,
      'is-focus': focus
    }"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    role="checkbox"
  >
    <input
      v-if="trueLabel || falseLabel"
      v-model="model"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      type="checkbox"
      class="y-checkbox-button__original"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    />
    <input
      v-else
      v-model="model"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      type="checkbox"
      class="y-checkbox-button__original"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    />

    <span class="y-checkbox-button__inner" v-if="$slots.default || label" :style="isChecked ? activeStyle : null">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script>
import emitter from 'main/mixins/emitter'

export default {
  name: 'YCheckboxButton',
  mixins: [emitter],
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number]
  },
  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    }
  },
  computed: {
    checkboxGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name !== 'YCheckboxGroup') {
          parent = parent.$parent
        } else {
          return parent
        }
      }
      return false
    },
    model: {
      get() {
        return this.checkboxGroup ? this.checkboxGroup.value : this.value ? this.value : this.selfModel
      },
      set(val) {
        if (this.checkboxGroup) {
          this.isLimitExceeded = false
          this.checkboxGroup.min !== undefined && val.length < this.checkboxGroup.min && (this.isLimitExceeded = true)
          this.checkboxGroup.max !== undefined && val.length > this.checkboxGroup.max && (this.isLimitExceeded = true)
          this.isLimitExceeded === false && this.dispatch('YCheckboxGroup', 'input', val)
        } else if (this.value !== undefined) {
          this.$emit('input', val)
        } else {
          this.selfModel = val
        }
      }
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel
      }
    },
    activeStyle() {
      return {
        backgroundColor: this.checkboxGroup.fill || '',
        borderColor: this.checkboxGroup.fill || '',
        color: this.checkboxGroup.textColor || '',
        'box-shadow': '-1px 0 0 0 ' + this.checkboxGroup.fill
      }
    },
    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this.checkboxGroup
      return (
        (!!(max || min) && this.model.length >= max && !this.isChecked) || (this.model.length <= min && this.isChecked)
      )
    },
    isDisabled() {
      return this.checkboxGroup
        ? this.checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled || this.isLimitDisabled
        : this.disabled || (this.elForm || {}).disabled
    },
    sizeClass() {
      return (
        this.size || (this.checkboxGroup || {}).size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
      )
    }
  },
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return
      let value
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel
      }
      this.$emit('change', value, ev)
      this.$nextTick(() => {
        if (this.checkboxGroup) {
          this.dispatch('YCheckboxGroup', 'change', this.checkboxGroup.value)
        }
      })
    }
  },
  created() {
    this.checked && this.addToStore()
  }
}
</script>
