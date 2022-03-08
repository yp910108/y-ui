<template>
  <div
    v-clickoutside="hide"
    :class="['y-color-picker', colorDisabled ? 'is-disabled' : '', sizeClass ? `y-color-picker--${sizeClass}` : '']"
  >
    <div class="y-color-picker__mask" v-if="colorDisabled" />
    <div class="y-color-picker__trigger" @click="handleTrigger">
      <span class="y-color-picker__color" :class="{ 'is-alpha': showAlpha }">
        <span
          class="y-color-picker__color-inner"
          :style="{
            backgroundColor: displayedColor
          }"
        />
        <span class="y-color-picker__empty y-icon-close" v-if="!value && !showPanelColor" />
      </span>
      <span class="y-color-picker__icon y-icon-arrow-down" v-show="value || showPanelColor" />
    </div>
    <picker-dropdown
      ref="dropdown"
      v-model="showPicker"
      :class="['y-color-picker__panel', popperClass || '']"
      :color="color"
      :show-alpha="showAlpha"
      :predefine="predefine"
      @pick="confirmValue"
      @clear="clearValue"
    />
  </div>
</template>

<script>
import clickoutside from 'main/directives/clickoutside'
import emitter from 'main/mixins/emitter'
import Color from './color'
import PickerDropdown from './components/picker-dropdown'

export default {
  name: 'YColorPicker',
  mixins: [emitter],
  directives: { clickoutside },
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    value: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: String,
    popperClass: String,
    predefine: Array
  },
  components: {
    PickerDropdown
  },
  data() {
    const color = new Color({
      enableAlpha: this.showAlpha,
      format: this.colorFormat
    })
    return {
      color,
      showPicker: false,
      showPanelColor: false
    }
  },
  methods: {
    handleTrigger() {
      if (this.colorDisabled) return
      this.showPicker = !this.showPicker
    },
    confirmValue() {
      const value = this.color.value
      this.$emit('input', value)
      this.$emit('change', value)
      this.dispatch('YFormItem', 'y.form.change', value)
      this.showPicker = false
    },
    clearValue() {
      this.$emit('input', null)
      this.$emit('change', null)
      if (this.value !== null) {
        this.dispatch('YFormItem', 'y.form.change', null)
      }
      this.showPanelColor = false
      this.showPicker = false
      this.resetColor()
    },
    hide() {
      this.showPicker = false
      this.resetColor()
    },
    resetColor() {
      this.$nextTick((_) => {
        if (this.value) {
          this.color.fromString(this.value)
        } else {
          this.showPanelColor = false
        }
      })
    },
    displayedRgb(color, showAlpha) {
      if (!(color instanceof Color)) {
        throw Error('color should be instance of Color Class')
      }
      const { r, g, b } = color.toRgb()
      return showAlpha ? `rgba(${r}, ${g}, ${b}, ${color.get('alpha') / 100})` : `rgb(${r}, ${g}, ${b})`
    }
  },
  computed: {
    displayedColor() {
      if (!this.value && !this.showPanelColor) {
        return 'transparent'
      }
      return this.displayedRgb(this.color, this.showAlpha)
    },
    sizeClass() {
      return this.size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
    },
    colorDisabled() {
      return this.disabled || this.yForm.disabled
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.showPanelColor = false
      } else if (val && val !== this.color.value) {
        this.color.fromString(val)
      }
    },
    color: {
      deep: true,
      handler() {
        this.showPanelColor = true
      }
    },
    displayedColor(val) {
      if (!this.showPicker) return
      const currentValueColor = new Color({
        enableAlpha: this.showAlpha,
        format: this.colorFormat
      })
      currentValueColor.fromString(this.value)

      const currentValueColorRgb = this.displayedRgb(currentValueColor, this.showAlpha)
      if (val !== currentValueColorRgb) {
        this.$emit('active-change', val)
      }
    }
  },
  mounted() {
    const value = this.value
    if (value) {
      this.color.fromString(value)
    }
    this.popperElm = this.$refs.dropdown.$el
  }
}
</script>
