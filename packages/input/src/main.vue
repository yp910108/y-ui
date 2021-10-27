<template>
  <div
    :class="[
      type === 'textarea' ? 'y-textarea' : 'y-input',
      {
        'y-input-group': $slots.prepend || $slots.append,
        'y-input-group--prepend': $slots.prepend
      }
    ]"
  >
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend" class="y-input-group__prepend">
        <slot name="prepend" />
      </div>
      <input ref="input" placeholder="请输入" v-bind="$attrs" class="y-input__inner" @input="handleInput" />
    </template>
    <template v-else></template>
  </div>
</template>

<script>
export default {
  name: 'YInput',
  props: {
    value: [String, Number],
    disabled: Boolean,
    type: { type: String, default: 'text' }
  },
  methods: {
    getInput() {
      return this.$refs.input
    },
    setNativeInputValue() {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    handleInput(e) {
      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (e.target.value === this.nativeInputValue) return

      this.$emit('input', e.target.value)

      // hack for https://github.com/ElemeFE/element/issues/12850
      // ensure native input value is controlled
      this.$nextTick(this.setNativeInputValue)
    }
  },
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  watch: {
    nativeInputValue() {
      this.setNativeInputValue()
    }
  },
  mounted() {
    this.setNativeInputValue()
  }
}
</script>
