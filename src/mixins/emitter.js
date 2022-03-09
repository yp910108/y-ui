function broadcast(componentName, eventName, ...params) {
  for (const child of this.$children) {
    const name = child.$options.name
    if (name === componentName) {
      child.$emit(eventName, ...params)
    } else {
      broadcast.call(child, componentName, eventName, ...params)
    }
  }
}

export default {
  methods: {
    dispatch(componentName, eventName, ...params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      while (!!parent) {
        if (name && name === componentName) break
        parent = parent.$parent
        !!parent && (name = parent.$options.name)
      }
      if (parent) {
        parent.$emit(eventName, ...params)
      }
    },
    broadcast(componentName, eventName, ...params) {
      broadcast.call(this, componentName, eventName, ...params)
    }
  }
}
