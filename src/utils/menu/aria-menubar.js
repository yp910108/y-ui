import MenuItem from './aria-menuitem'

export default class Menu {
  constructor(domNode) {
    this.domNode = domNode
    this.init()
  }
  init() {
    const menuChildren = this.domNode.childNodes
    for (const { nodeType } of menuChildren) {
      if (nodeType === 1) {
        new MenuItem(child)
      }
    }
  }
}
