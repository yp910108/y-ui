import { t } from '../locale'

export default {
  methods: {
    t(...args) {
      return t.call(this, ...args)
    }
  }
}
