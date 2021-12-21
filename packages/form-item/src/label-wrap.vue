<script>
export default {
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },
  data() {
    return {
      computedWidth: 0
    }
  },
  methods: {
    getLabelWidth() {
      const { width: computedWidth } = window.getComputedStyle(this.$el.firstElementChild)
      return Math.ceil(parseFloat(computedWidth))
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth()
        } else if (action === 'remove') {
          this.yForm.deregisterLabelWidth(this.computedWidth)
        }
      }
    }
  },
  render() {
    const slots = this.$slots.default
    if (!slots) return
    if (this.isAutoWidth) {
      const maxLabelWidth = this.yForm.maxLabelWidth
      const marginLeft = parseInt(maxLabelWidth) - this.computedWidth
      const style = { marginLeft: `${marginLeft}px` }
      return (
        <div class="y-form-item__label-wrap" style={style}>
          {slots}
        </div>
      )
    } else {
      return slots[0]
    }
  },
  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        this.yForm.registerLabelWidth(val, oldVal)
        this.yFormItem.updateComputedLabelWidth(val)
      }
    }
  },
  mounted() {
    this.updateLabelWidth('update')
  },
  updated() {
    this.updateLabelWidth('update')
  },
  beforeDestroy() {
    this.updateLabelWidth('remove')
  }
}
</script>
