import { on, off } from 'main/utils/dom'
import { BAR_MAP, renderThumbStyle } from './util'

export default {
  name: 'Bar',
  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },
  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal']
    },
    wrap() {
      return this.$parent.wrap
    }
  },
  methods: {
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return
      }
      this.startDrag(e)
      this[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])
    },
    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client])
      const thumbHalf = this.$refs.thumb[this.bar.offset] / 2
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / this.$el[this.bar.offset]
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },
    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true
      on(document, 'mousemove', this.mouseMoveDocumentHandler)
      on(document, 'mouseup', this.mouseUpDocumentHandler)
      document.onselectstart = () => false
    },
    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return
      const prevPage = this[this.bar.axis]
      if (!prevPage) return
      const offset = (this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1
      const thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / this.$el[this.bar.offset]
      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },
    mouseUpDocumentHandler() {
      this.cursorDown = false
      this[this.bar.axis] = 0
      off(document, 'mousemove', this.mouseMoveDocumentHandler)
      document.onselectstart = null
    }
  },
  render() {
    const { bar, size, move } = this
    return (
      <div class={['y-scrollbar__bar', 'is-' + bar.key]} onMousedown={this.clickTrackHandler}>
        <div
          ref="thumb"
          class="y-scrollbar__thumb"
          style={renderThumbStyle({ bar, size, move })}
          onMousedown={this.clickThumbHandler}
        />
      </div>
    )
  },
  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler)
  }
}
