<template>
  <ul v-show="visible" class="y-select-group__wrap">
    <li class="y-select-group__title">{{ label }}</li>
    <li>
      <ul class="y-select-group">
        <slot />
      </ul>
    </li>
  </ul>
</template>

<script>
import emitter from 'main/mixins/emitter'

export default {
  mixins: [emitter],
  name: 'YOptionGroup',
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: true
    }
  },
  methods: {
    queryChange() {
      this.visible =
        this.$children && Array.isArray(this.$children) && this.$children.some((option) => option.visible === true)
    }
  },
  watch: {
    disabled(val) {
      this.broadcast('YOption', 'handleGroupDisabled', val)
    }
  },
  created() {
    this.$on('queryChange', this.queryChange)
  },
  mounted() {
    if (this.disabled) {
      this.broadcast('YOption', 'handleGroupDisabled', this.disabled)
    }
  }
}
</script>
