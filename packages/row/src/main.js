export default {
  name: 'YRow',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: String
  },
  computed: {
    style() {
      const result = {}
      if (this.gutter) {
        result.marginLeft = `-${this.gutter / 2}px`
        result.marginRight = result.marginLeft
      }
      return result
    }
  },
  render(h) {
    return h(
      this.tag,
      {
        class: {
          'y-row': true,
          [`is-justify-${this.justify}`]: this.justify !== 'start',
          [`is-align-${this.align}`]: this.align,
          'y-row--flex': this.type === 'flex'
        },
        style: this.style
      },
      this.$slots.default
    )
  }
}
