<script>
export default {
  name: 'YTag',
  props: {
    text: String,
    closable: Boolean,
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String,
    effect: {
      type: String,
      default: 'light',
      validator(val) {
        return ['dark', 'light', 'plain'].indexOf(val) !== -1
      }
    }
  },
  methods: {
    handleClose(event) {
      event.stopPropagation()
      this.$emit('close', event)
    },
    handleClick(event) {
      this.$emit('click', event)
    }
  },
  computed: {
    tagSize() {
      return this.size || (this.$ELEMENT || {}).size
    }
  },
  render() {
    const { type, tagSize, hit, effect } = this
    const classes = {
      'y-tag': true,
      [`y-tag--${type}`]: type,
      [`y-tag--${tagSize}`]: tagSize,
      [`y-tag--${effect}`]: effect,
      'is-hit': hit
    }
    const tagEl = (
      <span class={classes} style={{ backgroundColor: this.color }} on-click={this.handleClick}>
        {this.$slots.default}
        {this.closable && <i class="y-tag__close y-icon-close" on-click={this.handleClose}></i>}
      </span>
    )

    return this.disableTransitions ? tagEl : <transition name="y-zoom-in-center">{tagEl}</transition>
  }
}
</script>
