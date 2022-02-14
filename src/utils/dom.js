import Vue from 'vue'

const isServer = Vue.prototype.$isServer
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = isServer ? 0 : Number(document.documentMode)

export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export const once = function (el, event, fn) {
  let listener = function (...args) {
    if (fn) {
      fn(...args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (matched, $1, $2, index, str) {
      return index ? $2.toUpperCase() : $2
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return ` ${el.className} `.includes(` ${cls} `)
  }
}

export function addClass(el, cls) {
  if (!el) return
  let curClass = el.className
  let classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.setAttribute('class', curClass)
  }
}

export function removeClass(el, cls) {
  if (!el || !cls) return
  let classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.setAttribute('class', trim(curClass))
  }
}

export const getStyle =
  ieVersion < 9
    ? function (element, styleName) {
        if (isServer) return
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'styleFloat'
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100
              } catch (e) {
                return 1.0
              }
            default:
              return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null
          }
        } catch (e) {
          return element.style[styleName]
        }
      }
    : function (element, styleName) {
        if (isServer) return
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'cssFloat'
        }
        try {
          let computed = document.defaultView.getComputedStyle(element, '')
          return element.style[styleName] || computed ? computed[styleName] : null
        } catch (e) {
          return element.style[styleName]
        }
      }
