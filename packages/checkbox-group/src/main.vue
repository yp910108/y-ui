<template>
  <div class="y-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import emitter from 'main/mixins/emitter'

export default {
  name: 'YCheckboxGroup',
  mixins: [emitter],
  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },

  watch: {
    value(value) {
      this.dispatch('YFormItem', 'y.form.change', value)
    }
  }
}
</script>
