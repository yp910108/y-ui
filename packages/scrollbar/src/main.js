// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import { addResizeListener, removeResizeListener } from 'main/utils/resize-event'
import scrollbarWidth from 'main/utils/scrollbar-width'
import { toObject } from 'main/utils/util'
import Bar from './bar'

export default {
  name: 'YScrollbar',
  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },
  components: { Bar },
  data() {
    return {
      moveX: 0,
      moveY: 0,
      sizeWidth: '0',
      sizeHeight: '0'
    }
  },
  methods: {
    handleScroll() {
      const wrap = this.wrap
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
    },
    update() {
      let heightPercentage, widthPercentage
      const wrap = this.wrap
      if (!wrap) return
      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth
      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
    }
  },
  computed: {
    wrap() {
      return this.$refs.wrap
    }
  },
  render(h) {
    let gutter = scrollbarWidth()
    let style = this.wrapStyle
    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`
      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle)
        style.marginRight = style.marginBottom = gutterWith
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }
    const view = h(
      this.tag,
      {
        ref: 'resize',
        class: ['y-scrollbar__view', this.viewClass],
        style: this.viewStyle
      },
      this.$slots.default
    )
    const wrap = (
      <div
        ref="wrap"
        class={[this.wrapClass, 'y-scrollbar__wrap', gutter ? '' : 'y-scrollbar__wrap--hidden-default']}
        style={style}
        onScroll={this.handleScroll}
      >
        {[view]}
      </div>
    )
    let nodes
    if (!this.native) {
      nodes = [
        wrap,
        <Bar move={this.moveX} size={this.sizeWidth} />,
        <Bar vertical move={this.moveY} size={this.sizeHeight} />
      ]
    } else {
      nodes = [
        <div ref="wrap" class={[this.wrapClass, 'y-scrollbar__wrap']} style={style}>
          {[view]}
        </div>
      ]
    }
    return h('div', { class: 'y-scrollbar' }, nodes)
  },
  mounted() {
    if (this.native) return
    this.$nextTick(this.update)
    !this.noresize && addResizeListener(this.$refs.resize, this.update)
  },
  beforeDestroy() {
    if (this.native) return
    !this.noresize && removeResizeListener(this.$refs.resize, this.update)
  }
}
