export let ignoreUtilFocusChanges = true

export function isFocusable(element) {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
    return true
  }
  if (element.disabeld) {
    return false
  }
  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel !== 'ignore'
    case 'INPUT':
      return element.type !== 'hidden' && element.type !== 'file'
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true
    default:
      return false
  }
}

/**
 * @desc Set Attempt to set focus on the current node.
 * @param element
 *          The node to attempt to focus on.
 * @returns
 *  true if element is focused.
 */
export function attemptFocus(element) {
  if (!isFocusable(element)) {
    return false
  }
  ignoreUtilFocusChanges = true
  try {
    element.focus()
  } catch (e) {
    // do nothing
  }
  ignoreUtilFocusChanges = false
  return document.activeElement === element
}

/**
 * @desc Set focus on descendant nodes until the first focusable element is
 *       found.
 * @param element
 *          DOM node for which to find the first focusable descendant.
 * @returns
 *  true if a focusable element is found and focus is set.
 */
export function focusFirstDescendant(element) {
  for (const child of element.childNodes) {
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true
    }
  }
  return false
}

/**
 * @desc Find the last descendant node that is focusable.
 * @param element
 *          DOM node for which to find the last focusable descendant.
 * @returns
 *  true if a focusable element is found and focus is set.
 */
export function focusLastDescendant(element) {
  let child
  while ((child = element.childNodes.pop())) {
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true
    }
  }
  return false
}

/**
 * 触发一个事件
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export function triggerEvent(element, name, ...opts) {
  let eventName
  if (/^mouse|click/.test(name)) {
    eventName = 'MouseEvents'
  } else if (/^key/.test(name)) {
    eventName = 'KeyboardEvent'
  } else {
    eventName = 'HTMLEvents'
  }
  const event = document.createEvent(eventName)
  event.initEvent(name, ...opts)
  if (element.dispatchEvent) {
    element.dispatchEvent(event)
  } else {
    element.fireEvent(`on${name}`, event)
  }
  return element
}

export const KEYS = {
  tab: 9,
  enter: 13,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  esc: 27
}
