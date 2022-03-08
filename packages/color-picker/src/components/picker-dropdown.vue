<template>
  <transition name="y-zoom-in-top" @after-leave="doDestroy">
    <div class="y-color-dropdown" v-show="showPopper">
      <div class="y-color-dropdown__main-wrapper">
        <hue-slider ref="hue" :color="color" vertical style="float: right" />
        <sv-panel ref="sl" :color="color" />
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color" />
      <predefine v-if="predefine" :color="color" :colors="predefine" />
      <div class="y-color-dropdown__btns">
        <span class="y-color-dropdown__value">
          <y-input
            v-model="customInput"
            :validate-event="false"
            size="mini"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
          />
        </span>
        <y-button size="mini" type="text" class="y-color-dropdown__link-btn" @click="$emit('clear')">
          {{ t('y.colorpicker.clear') }}
        </y-button>
        <y-button plain size="mini" class="y-color-dropdown__btn" @click="confirmValue">
          {{ t('y.colorpicker.confirm') }}
        </y-button>
      </div>
    </div>
  </transition>
</template>

<script>
import SvPanel from './sv-panel'
import HueSlider from './hue-slider'
import AlphaSlider from './alpha-slider'
import Predefine from './predefine'
import Popper from 'main/mixins/vue-popper'
import Locale from 'main/mixins/locale'
import YInput from 'packages/input'
import YButton from 'packages/button'

export default {
  name: 'y-color-picker-dropdown',

  mixins: [Popper, Locale],

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    YInput,
    YButton,
    Predefine
  },

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array
  },

  data() {
    return {
      customInput: ''
    }
  },

  computed: {
    currentColor() {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value
    }
  },

  methods: {
    confirmValue() {
      this.$emit('pick')
    },

    handleConfirm() {
      this.color.fromString(this.customInput)
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    },

    currentColor: {
      immediate: true,
      handler(val) {
        this.customInput = val
      }
    }
  }
}
</script>
