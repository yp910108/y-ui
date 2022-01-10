<template>
  <a
    :class="{
      'y-link': true,
      [`y-link--${type}`]: type,
      'is-disabled': disabled,
      'is-underline': underline && !disabled
    }"
    v-bind="{
      ...$attrs,
      href: disabled ? null : href
    }"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon" />
    <span v-if="$slots.default" class="y-link--inner">
      <slot />
    </span>
    <template v-if="$slots.icon">
      <slot v-if="$slots.icon" name="icon" />
    </template>
  </a>
</template>

<script>
export default {
  name: 'YLink',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: String,
    icon: String
  },
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        if (!this.href) {
          this.$emit('click', event)
        }
      }
    }
  }
}
</script>
