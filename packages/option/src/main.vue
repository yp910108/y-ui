<template>
  <li
    v-show="visible"
    :class="{
      selected: itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      hover
    }"
    class="y-select-dropdown__item"
    @click.stop="selectOptionClick"
    @mouseenter="hoverItem"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script>
import { getValueByPath, escapeRegexpString } from 'main/utils/util'
import emitter from 'main/mixins/emitter'

export default {
  name: 'YOption',
  mixins: [emitter],
  inject: {
    ySelect: {
      default: () => ({})
    }
  },
  props: {
    value: {
      required: true
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false
    }
  },
  methods: {
    isEqual(a, b) {
      if (!this.isObject) {
        return a === b
      } else {
        const valueKey = this.ySelect.valueKey
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
      }
    },
    contains(arr = [], target) {
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1
      } else {
        const valueKey = this.ySelect.valueKey
        return (
          arr &&
          arr.some((item) => {
            return getValueByPath(item, valueKey) === getValueByPath(target, valueKey)
          })
        )
      }
    },
    handleGroupDisabled(val) {
      this.groupDisabled = val
    },
    hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.ySelect.hoverIndex = this.ySelect.options.indexOf(this)
      }
    },
    selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('YSelect', 'handleOptionClick', this, true)
      }
    },
    queryChange(query) {
      this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created
      if (!this.visible) {
        this.ySelect.filteredOptionsCount--
      }
    }
  },
  computed: {
    isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
    },
    currentLabel() {
      return this.label || (this.isObject ? '' : this.value)
    },
    currentValue() {
      return this.value || this.label || ''
    },
    itemSelected() {
      if (!this.ySelect.multiple) {
        return this.isEqual(this.value, this.ySelect.value)
      } else {
        return this.contains(this.ySelect.value, this.value)
      }
    },
    limitReached() {
      if (this.ySelect.multiple) {
        return (
          !this.itemSelected &&
          (this.ySelect.value || []).length >= this.ySelect.multipleLimit &&
          this.ySelect.multipleLimit > 0
        )
      } else {
        return false
      }
    }
  },
  created() {
    this.ySelect.options.push(this)
    this.ySelect.initialOptions.push(this)
    this.ySelect.optionsCount++
    this.ySelect.filteredOptionsCount++

    this.$on('queryChange', this.queryChange)
    this.$on('handleGroupDisabled', this.handleGroupDisabled)
  },
  beforeDestroy() {
    const { selected, multiple } = this.ySelect
    let selectedOptions = multiple ? selected : [selected]
    let index = this.ySelect.initialOptions.indexOf(this)
    let selectedIndex = selectedOptions.indexOf(this)

    // if option is not selected, remove it from cache
    if (index > -1 && selectedIndex < 0) {
      this.ySelect.initialOptions.splice(index, 1)
    }
    this.ySelect.onOptionDestroy(this.ySelect.options.indexOf(this))
  }
}
</script>
