<template>
  <label
    :class="{
      'y-radio-button': true,
      [`y-radio-button--${sizeClass}`]: sizeClass,
      'is-active': model === label,
      'is-disabled': isDisabled,
      'is-focus': focus
    }"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <input
      v-model="model"
      :value="label"
      :name="name"
      :disabled="isDisabled"
      type="radio"
      autocomplete="off"
      tabindex="-1"
      class="y-radio-button__orig-radio"
      @focus="focus = true"
      @blur="focus = false"
      @change="handleChange"
    />
    <span class="y-radio-button__inner" :style="model === label ? activeStyle : null" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
<script>
import emitter from 'main/mixins/emitter'

export default {
  name: 'YRadioButton',
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
    label: {},
    disabled: Boolean,
    name: String
  },
  data() {
    return {
      focus: false
    }
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.dispatch('YRadioGroup', 'handleChange', this.model)
      })
    }
  },
  computed: {
    radioGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name !== 'YRadioGroup') {
          parent = parent.$parent
        } else {
          return parent
        }
      }
      return false
    },
    model: {
      get() {
        return this.radioGroup.value
      },
      set(value) {
        this.dispatch('YRadioGroup', 'input', value)
      }
    },
    activeStyle() {
      return {
        backgroundColor: this.radioGroup.fill || '',
        borderColor: this.radioGroup.fill || '',
        boxShadow: this.radioGroup.fill ? `-1px 0 0 0 ${this.radioGroup.fill}` : '',
        color: this.radioGroup.textColor || ''
      }
    },
    sizeClass() {
      return (
        this.size || (this.radioGroup || {}).size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
      )
    },
    isDisabled() {
      return this.disabled || this.radioGroup.disabled || (this.yForm || {}).disabled
    },
    tabIndex() {
      return this.isDisabled || (this.radioGroup && this.value !== this.label) ? -1 : 0
    }
  }
}
</script>
