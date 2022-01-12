<template>
  <label
    :id="id"
    :class="{
      'y-checkbox': true,
      [`y-checkbox--${sizeClass}`]: sizeClass,
      'is-disabled': isDisabled,
      'is-bordered': border,
      'is-checked': isChecked
    }"
  >
    <span
      :class="{
        'y-checkbox__input': true,
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focused
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="y-checkbox__inner" />
      <input
        v-if="trueLabel || falseLabel"
        v-model="model"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        type="checkbox"
        class="y-checkbox__original"
        @change="handleChange"
        @focus="focused = true"
        @blur="focused = false"
      />
      <input
        v-else
        v-model="model"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :value="label"
        type="checkbox"
        class="y-checkbox__original"
        @change="handleChange"
        @focus="focused = true"
        @blur="focused = false"
      />
    </span>
    <span class="y-checkbox__label" v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script>
import emitter from 'main/mixins/emitter'

export default {
  name: 'YCheckbox',
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
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    border: Boolean,
    size: String
  },
  data() {
    return {
      selfModel: false,
      focused: false,
      isLimitExceeded: false,
      checkboxGroup: undefined
    }
  },
  computed: {
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name !== 'YCheckboxGroup') {
          parent = parent.$parent
        } else {
          this.checkboxGroup = parent
          return true
        }
      }
      return false
    },
    model: {
      get() {
        return this.isGroup ? this.checkboxGroup.value : this.value ? this.value : this.selfModel
      },
      set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false
          this.checkboxGroup.min !== undefined && val.length < this.checkboxGroup.min && (this.isLimitExceeded = true)
          this.checkboxGroup.max !== undefined && val.length > this.checkboxGroup.max && (this.isLimitExceeded = true)
          this.isLimitExceeded === false && this.dispatch('YCheckboxGroup', 'input', val)
        } else {
          this.$emit('input', val)
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
    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled() {
      const { max, min } = this.checkboxGroup
      return (
        (!!(max || min) && this.model.length >= max && !this.isChecked) || (this.model.length <= min && this.isChecked)
      )
    },
    isDisabled() {
      return this.isGroup
        ? this.checkboxGroup.disabled || this.disabled || (this.yForm || {}).disabled || this.isLimitDisabled
        : this.disabled || (this.yForm || {}).disabled
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
        if (this.isGroup) {
          this.dispatch('YCheckboxGroup', 'change', this.checkboxGroup.value)
        }
      })
    }
  },
  watch: {
    value(value) {
      this.dispatch('YFormItem', 'y.form.change', value)
    }
  },
  created() {
    this.checked && this.addToStore()
  },
  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  }
}
</script>
