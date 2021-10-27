import { KEYS, triggerEvent } from '../aria-utils'

export default class SubMenu {
  constructor(parent, domNode) {
    this.parent = parent
    this.domNode = domNode
    this.subIndex = 0
    this.subMenuItems = []
    this.init()
  }
  init() {
    this.subMenuItems = this.domNode.querySelectorAll('li')
    this.addListeners()
  }
  addListeners() {
    const parentNode = this.parent.domNode
    for (const subMenuItem of this.subMenuItems) {
      subMenuItem.addEventListener('keydown', (event) => {
        let prevDef = false
        switch (event.keyCode) {
          case KEYS.down:
            this.gotoSubIndex(this.subIndex + 1)
            prevDef = true
            break
          case KEYS.up:
            this.gotoSubIndex(this.subIndex - 1)
            prevDef = true
            break
          case KEYS.tab:
            triggerEvent(parentNode, 'mouseleave')
            break
          case KEYS.enter:
          case KEYS.space:
            prevDef = true
            event.currentTarget.click()
            break
        }
        if (prevDef) {
          event.preventDefault()
          event.stopPropagation()
        }
        return false
      })
    }
  }
  gotoSubIndex(index) {
    if (index === this.subMenuItems.length) {
      index = 0
    } else if (index < 0) {
      index = this.subMenuItems.length - 1
    }
    this.subMenuItems[index].focus()
    this.subIndex = index
  }
}
