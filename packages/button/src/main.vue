<template>
  <button
    class="y-button"
    :class="{
      [`y-button--${type}`]: type,
      [`y-button--${sizeClass}`]: sizeClass,
      'is-disabled': buttonDisabled,
      'is-loading': loading,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle
    }"
  >
    <i v-if="loading" class="y-icon-loading" />
    <i v-if="!loading && icon" :class="icon" />
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  name: 'YButton',
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: String,
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  },
  computed: {
    sizeClass() {
      return this.size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
    },
    buttonDisabled() {
      return this.disabled || this.yForm.disabled
    }
  }
}
</script>
