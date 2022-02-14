import Vue from 'vue'

export function noop() {}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key]
  }
  return to
}

export function toObject(arr) {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export const getValueByPath = function (object, prop) {
  prop = prop || ''
  const paths = prop.split('.')
  let current = object
  let result = null
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i]
    if (!current) break
    if (i === j - 1) {
      result = current[path]
      break
    }
    current = current[path]
  }
  return result
}

// export function getPropByPath(obj, path) {
//   path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '')
//   const keys = path.split('.')
//   let o = obj
//   for (const key of keys.slice(0, -1)) {
//     o && (o = o[key])
//   }
//   const k = keys[keys.length - 1]
//   return { o, k, v: o[k] }
// }

export function getPropByPath(obj, path, strict) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  let keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    let key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!')
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
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

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true
  if (!(a instanceof Array)) return false
  if (!(b instanceof Array)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
