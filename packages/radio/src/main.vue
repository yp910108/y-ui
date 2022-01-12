<template>
  <label
    :class="{
      'y-radio': true,
      [`y-radio--${sizeClass}`]: border && sizeClass,
      'is-disabled': isDisabled,
      'is-focus': focused,
      'is-bordered': border,
      'is-checked': model === label
    }"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      :class="{
        'y-radio__input': true,
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="y-radio__inner" />
      <input
        ref="radio"
        v-model="model"
        :name="name"
        :value="label"
        :disabled="isDisabled"
        type="radio"
        tabindex="-1"
        class="y-radio__original"
        aria-hidden="true"
        autocomplete="off"
        @focus="focused = true"
        @blur="focused = false"
        @change="handleChange"
      />
    </span>
    <span class="y-radio__label" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import emitter from 'main/mixins/emitter'

export default {
  name: 'YRadio',
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
    name: String,
    border: Boolean,
    size: String
  },
  data() {
    return {
      focused: false,
      radioGroup: undefined
    }
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit('change', this.model)
        this.isGroup && this.dispatch('YRadioGroup', 'handleChange', this.model)
      })
    }
  },
  computed: {
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name !== 'YRadioGroup') {
          parent = parent.$parent
        } else {
          this.radioGroup = parent
          return true
        }
      }
      return false
    },
    model: {
      get() {
        return this.isGroup ? this.radioGroup.value : this.value
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch('YRadioGroup', 'input', val)
        } else {
          this.$emit('input', val)
        }
      }
    },
    sizeClass() {
      return (
        this.size || (this.radioGroup || {}).size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
      )
    },
    isDisabled() {
      return this.disabled || (this.radioGroup || {}).disabled || this.yForm.disabled
    },
    tabIndex() {
      return this.isDisabled || (this.isGroup && this.model !== this.label) ? -1 : 0
    }
  }
}
</script>
