<template>
  <transition name="y-fade-in">
    <div
      v-if="visible"
      class="y-backtop"
      :style="{
        right: styleRight,
        bottom: styleBottom
      }"
      @click.stop="handleClick"
    >
      <slot>
        <y-icon name="caret-top" />
      </slot>
    </div>
  </transition>
</template>

<script>
import throttle from 'throttle-debounce/throttle'

const cubic = (value) => Math.pow(value, 3)
const easeInOutCubic = (value) => (value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2)

export default {
  name: 'YBacktop',
  props: {
    target: [String],
    visibilityHeight: {
      type: Number,
      default: 200
    },
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      el: null,
      container: null,
      visible: false
    }
  },
  methods: {
    init() {
      this.container = document
      this.el = document.documentElement
      if (this.target) {
        this.el = document.querySelector(this.target)
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`)
        }
        this.container = this.el
      }
    },
    onScroll() {
      const scrollTop = this.el.scrollTop
      this.visible = scrollTop >= this.visibilityHeight
    },
    scrollToTop() {
      const el = this.el
      const startTime = Date.now()
      const startTop = el.scrollTop
      const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - startTime) / 500
        if (progress < 1) {
          el.scrollTop = startTop * (1 - easeInOutCubic(progress))
          rAF(frameFunc)
        } else {
          el.scrollTop = 0
        }
      }
      rAF(frameFunc)
    },
    handleClick(e) {
      this.scrollToTop()
      this.$emit('click', e)
    }
  },
  computed: {
    styleRight() {
      return `${this.right}px`
    },
    styleBottom() {
      return `${this.bottom}px`
    }
  },
  mounted() {
    this.init()
    this.throttledScrollHandler = throttle(300, this.onScroll)
    this.container.addEventListener('scroll', this.throttledScrollHandler)
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttledScrollHandler)
  }
}
</script>
