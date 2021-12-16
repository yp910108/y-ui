export default function (...args) {
  const result = {}
  for (const source of args) {
    for (const prop in source) {
      if (Object.hasOwnProperty.call(source, prop)) {
        const value = source[prop]
        if (value !== undefined) {
          result[prop] = value
        }
      }
    }
  }
  return result
}
