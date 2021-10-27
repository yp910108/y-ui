import { KEYS, triggerEvent } from '../aria-utils'
import SubMenu from './aria-submenu'

export default class MenuItem {
  constructor(domNode) {
    this.domNode = domNode
    this.submenu = null
    this.init()
  }
  init() {
    this.domNode.setAttribute('tabindex', '0')
    const menuChild = this.domNode.querySelector('.el-menu')
    if (menuChild) {
      this.submenu = new SubMenu(this, menuChild)
    }
    this.addListeners()
  }
  addListeners() {
    this.domNode.addEventListener('keydown', (event) => {
      let prevDef = false
      switch (event.keyCode) {
        case KEYS.down:
          triggerEvent(event.currentTarget, 'mouseenter')
          this.submenu && this.submenu.gotoSubIndex(0)
          prevDef = true
          break
        case KEYS.up:
          triggerEvent(event.currentTarget, 'mouseenter')
          this.submenu && this.submenu.gotoSubIndex(this.submenu.subMenuItems.length - 1)
          prevDef = true
          break
        case KEYS.tab:
          triggerEvent(event.currentTarget, 'mouseleave')
          break
        case KEYS.enter:
        case KEYS.space:
          prevDef = true
          event.currentTarget.click()
          break
      }
      if (prevDef) {
        event.preventDefault()
      }
    })
  }
}
