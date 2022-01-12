<template>
  <div class="y-radio-group" role="radiogroup" @keydown="handleKeydown">
    <slot />
  </div>
</template>
<script>
import emitter from 'main/mixins/emitter'

const KEY_CODE = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})

export default {
  name: 'YRadioGroup',
  mixins: [emitter],
  props: {
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  methods: {
    handleKeydown(e) {
      // 左、右、上、下按键，可以在 radio 组内切换不同选项
      const target = e.target
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
      const radios = this.$el.querySelectorAll(className)
      const length = radios.length
      const index = [].indexOf.call(radios, target)
      const roleRadios = this.$el.querySelectorAll('[role=radio]')
      switch (e.keyCode) {
        case KEY_CODE.LEFT:
        case KEY_CODE.UP:
          e.stopPropagation()
          e.preventDefault()
          if (index === 0) {
            roleRadios[length - 1].click()
            roleRadios[length - 1].focus()
          } else {
            roleRadios[index - 1].click()
            roleRadios[index - 1].focus()
          }
          break
        case KEY_CODE.RIGHT:
        case KEY_CODE.DOWN:
          if (index === length - 1) {
            e.stopPropagation()
            e.preventDefault()
            roleRadios[0].click()
            roleRadios[0].focus()
          } else {
            roleRadios[index + 1].click()
            roleRadios[index + 1].focus()
          }
          break
        default:
          break
      }
    }
  },
  created() {
    this.$on('handleChange', (value) => {
      this.$emit('change', value)
    })
  },
  mounted() {
    // 当 radioGroup 没有默认选项时，第一个可以选中 Tab 导航
    const radios = this.$el.querySelectorAll('[type=radio]')
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0]
    if (![].some.call(radios, (radio) => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0
    }
  },
  watch: {
    value(newVal) {
      this.dispatch('YFormItem', 'y.form.change', newVal)
    }
  }
}
</script>
