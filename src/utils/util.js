import Vue from 'vue'

export function noop() {}

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key]
  }
  return to
}

export function toObject(arr) {
  var res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function getPropByPath(obj, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')
  const keys = path.split('.')
  let o = obj
  for (const key of keys.slice(0, -1)) {
    o && (o = o[key])
  }
  const k = keys[keys.length - 1]
  return { o, k, v: o[k] }
}

export const kebabCase = function (str) {
  const hyphenateRE = /([^-])([A-Z])/g
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase()
}

export const isIE = function () {
  return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode))
}

export const isEdge = function () {
  return !Vue.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1
}

export const isFirefox = function () {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i)
}
