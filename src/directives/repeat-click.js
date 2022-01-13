import { once, on } from 'main/utils/dom'

export default {
  bind(el, { expression }, { context }) {
    let interval = null
    let startTime
    const handler = () => context[expression]()
    const clear = () => {
      if (Date.now() - startTime < 100) {
        handler()
      }
      clearInterval(interval)
      interval = null
    }
    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return
      startTime = Date.now()
      once(document, 'mouseup', clear)
      clearInterval(interval)
      interval = setInterval(handler, 100)
    })
  }
}
