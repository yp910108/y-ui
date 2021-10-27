export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.call(parent, eventName, ...params)
      }
    },
    broadcast(componentName, eventName, params) {
      for (const child of this.$children) {
        const name = child.$options.componentName
        if (name === componentName) {
          child.$emit.call(child, eventName, ...params)
        } else {
          this.broadcast.call(child, componentName, eventName, ...params)
        }
      }
    }
  }
}
