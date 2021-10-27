export function noop() {}

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
