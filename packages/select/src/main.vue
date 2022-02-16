<template>
  <div
    v-clickoutside="handleClose"
    :class="{
      'y-select': true,
      [`y-select-${sizeClass}`]: sizeClass
    }"
    @click.stop="toggleMenu"
  >
    <div
      v-if="multiple"
      ref="tags"
      class="y-select__tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
    >
      <span v-if="collapseTags && selected.length">
        <y-tag
          type="info"
          disable-transitions
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          @close="deleteTag($event, selected[0])"
        >
          <span class="y-select__tags-text">{{ selected[0].currentLabel }}</span>
        </y-tag>
        <y-tag v-if="selected.length > 1" type="info" disable-transitions :closable="false" :size="collapseTagSize">
          <span class="y-select__tags-text">+ {{ selected.length - 1 }}</span>
        </y-tag>
      </span>
      <transition-group v-if="!collapseTags" @after-leave="resetInputHeight">
        <y-tag
          v-for="item in selected"
          type="info"
          disable-transitions
          :key="getValueKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="item.hitState"
          @close="deleteTag($event, item)"
        >
          <span class="y-select__tags-text">{{ item.currentLabel }}</span>
        </y-tag>
      </transition-group>
      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        type="text"
        :class="{ 'y-select__input': true, [`is-${sizeClass}`]: sizeClass }"
        :disabled="selectDisabled"
        :autocomplete="autoComplete || autocomplete"
        :style="{ 'flex-grow': '1', width: inputLength / (inputWidth - 32) + '%', 'max-width': inputWidth - 42 + 'px' }"
        @focus="handleFocus"
        @blur="softFocus = false"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="debouncedOnQueryChange"
      />
    </div>
    <y-input
      ref="reference"
      v-model="selectedLabel"
      :id="id"
      :name="name"
      :placeholder="currentPlaceholder"
      :autocomplete="autoComplete || autocomplete"
      :size="sizeClass"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : null"
      type="text"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix" />
      </template>
      <template slot="suffix">
        <i v-show="!showClose" :class="['y-select__caret', 'y-input__icon', `y-icon-${iconClass}`]" />
        <i v-if="showClose" class="y-select__caret y-input__icon y-icon-circle-close" @click="handleClearClick" />
      </template>
    </y-input>
    <transition name="y-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <y-select-menu v-show="visible && emptyText !== false" ref="popper" :append-to-body="popperAppendToBody">
        <y-scrollbar
          v-show="options.length > 0 && !loading"
          ref="scrollbar"
          tag="ul"
          wrap-class="y-select-dropdown__wrap"
          view-class="y-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
        >
          <y-option v-if="showNewOption" :value="query" created />
          <slot />
        </y-scrollbar>
        <template v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0))">
          <slot name="empty" v-if="$slots.empty" />
          <p class="y-select-dropdown__empty" v-else>
            {{ emptyText }}
          </p>
        </template>
      </y-select-menu>
    </transition>
  </div>
</template>

<script>
import debounce from 'throttle-debounce/debounce'
import { isIE, isEdge, getValueByPath, valueEquals } from 'main/utils/util'
import { isKorean } from 'main/utils/shared'
import scrollIntoView from 'main/utils/scroll-into-view'
import { addResizeListener, removeResizeListener } from 'main/utils/resize-event'
import focus from 'main/mixins/focus'
import locale from 'main/mixins/locale'
import emitter from 'main/mixins/emitter'
import clickoutside from 'main/directives/clickoutside'
import YInput from 'packages/input'
import YScrollbar from 'packages/scrollbar'
import YOption from 'packages/option'
import YSelectMenu from './select-dropdown'
import navigationMixin from './navigation-mixin'

export default {
  name: 'YSelect',
  mixins: [emitter, locale, focus('reference'), navigationMixin],
  directives: { clickoutside },
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    id: String,
    name: String,
    value: {
      required: true
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator() {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Yui Warn][Select]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      required: false
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  components: {
    YInput,
    YScrollbar,
    YSelectMenu,
    YOption
  },
  data() {
    return {
      options: [],
      initialOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      inputHovering: false,
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      currentPlaceholder: '',
      initialPlaceHolder: '',
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    }
  },
  provide() {
    return {
      ySelect: this
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false
        } else {
          this.visible = !this.visible
        }
        if (this.visible) {
          ;(this.$refs.input || this.$refs.reference).focus()
        }
      }
    },
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val)
      }
    },
    deleteTag(event, tag) {
      const index = this.selected.indexOf(tag)
      if (index > -1 && !this.selectDisabled) {
        const value = this.value.slice()
        value.splice(index, 1)
        this.$emit('input', value)
        this.emitChange(value)
        this.$emit('remove-tag', tag.value)
      }
      event.stopPropagation()
    },
    getValueKey(item) {
      if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
        return item.value
      } else {
        return getValueByPath(item.value, this.valueKey)
      }
    },
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          if (this.filterable && !this.visible) {
            this.menuVisibleOnFocus = true
          }
          this.visible = true
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    },
    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.initialPlaceHolder
      }
    },
    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) return
      const option = this.selected[this.selected.length - 1]
      if (!option) return
      if (hit === true || hit === false) {
        option.hitState = hit
        return hit
      }
      option.hitState = !option.hitState
      return option.hitState
    },
    resetInputHeight() {
      if (this.collapseTags && !this.filterable) return
      this.$nextTick(() => {
        if (!this.$refs.reference) return
        const inputChildNodes = this.$refs.reference.$el.childNodes
        const input = [].filter.call(inputChildNodes, (item) => item.tagName === 'INPUT')[0]
        const tags = this.$refs.tags
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0
        const sizeInMap = this.initialInputHeight || 40
        input.style.height =
          this.selected.length === 0
            ? sizeInMap + 'px'
            : Math.max(tags ? tagsHeight + (tagsHeight > sizeInMap ? 6 : 0) : 0, sizeInMap) + 'px'
        if (this.visible && this.emptyText !== false) {
          this.broadcast('YSelectDropdown', 'updatePopper')
        }
      })
    },
    resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false)
      this.inputLength = this.$refs.input.value.length * 15 + 20
      this.resetInputHeight()
    },
    onQueryChange(val) {
      if (this.previousQuery === val || this.isOnComposition) return
      if (
        this.previousQuery === null &&
        (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')
      ) {
        this.previousQuery = val
        return
      }
      this.previousQuery = val
      this.$nextTick(() => {
        if (this.visible) this.broadcast('YSelectDropdown', 'updatePopper')
      })
      this.hoverIndex = -1
      if (this.multiple && this.filterable) {
        this.$nextTick(() => {
          const length = this.$refs.input.value.length * 15 + 20
          this.inputLength = this.collapseTags ? Math.min(50, length) : length
          this.managePlaceholder()
          this.resetInputHeight()
        })
      }
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.hoverIndex = -1
        this.remoteMethod(val)
      } else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val)
        this.broadcast('YOptionGroup', 'queryChange')
      } else {
        this.filteredOptionsCount = this.optionsCount
        this.broadcast('YOption', 'queryChange', val)
        this.broadcast('YOptionGroup', 'queryChange')
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption()
      }
    },
    handleOptionClick(option, byClick) {
      if (this.multiple) {
        const value = (this.value || []).slice()
        const optionIndex = this.getValueIndex(value, option.value)
        if (optionIndex > -1) {
          value.splice(optionIndex, 1)
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value)
        }
        this.$emit('input', value)
        this.emitChange(value)
        if (option.created) {
          this.query = ''
          this.onQueryChange('')
          this.inputLength = 20
        }
        if (this.filterable) this.$refs.input.focus()
      } else {
        this.$emit('input', option.value)
        this.emitChange(option.value)
        this.visible = false
      }
      this.isSilentBlur = byClick
      this.setSoftFocus()
      if (this.visible) return
      this.$nextTick(() => {
        this.scrollToOption(option)
      })
    },
    selectOption() {
      if (!this.visible) {
        this.toggleMenu()
      } else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionClick(this.options[this.hoverIndex])
        }
      }
    },
    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice()
        value.pop()
        this.$emit('input', value)
        this.emitChange(value)
      }
    },
    handleComposition(event) {
      const text = event.target.value
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.$nextTick(() => this.onQueryChange(text))
      } else {
        const lastCharacter = text[text.length - 1] || ''
        this.isOnComposition = !isKorean(lastCharacter)
      }
    },
    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false
        } else {
          this.$emit('blur', event)
        }
      }, 50)
      this.softFocus = false
    },
    deleteSelected(event) {
      event.stopPropagation()
      const value = this.multiple ? [] : ''
      this.$emit('input', value)
      this.emitChange(value)
      this.visible = false
      this.$emit('clear')
    },
    handleClearClick(event) {
      this.deleteSelected(event)
    },
    scrollToOption(option) {
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector('.y-select-dropdown__wrap')
        scrollIntoView(menu, target)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },
    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected))
    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
    getValueIndex(arr = [], value) {
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
      if (!isObject) {
        return arr.indexOf(value)
      } else {
        const valueKey = this.valueKey
        let index = -1
        arr.some((item, i) => {
          if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
            index = i
            return true
          }
          return false
        })
        return index
      }
    },
    setSoftFocus() {
      this.softFocus = true
      const input = this.$refs.input || this.$refs.reference
      if (input) {
        input.focus()
      }
    },
    checkDefaultFirstOption() {
      this.hoverIndex = -1
      // highlight the created option
      let hasCreated = false
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true
          this.hoverIndex = i
          break
        }
      }
      if (hasCreated) return
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i]
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i
            break
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = i
            break
          }
        }
      }
    },
    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
        this.onQueryChange(this.query)
      }
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },
    handleResize() {
      this.resetInputWidth()
      if (this.multiple) this.resetInputHeight()
    },
    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--
        this.filteredOptionsCount--
        this.options.splice(index, 1)
      }
    },
    getOption(value) {
      let option
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
      const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]'
      const isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]'
      for (let i = this.initialOptions.length - 1; i >= 0; i--) {
        const initialOption = this.initialOptions[i]
        const isEqual = isObject
          ? getValueByPath(initialOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
          : initialOption.value === value
        if (isEqual) {
          option = initialOption
          break
        }
      }
      if (option) return option
      const label = !isObject && !isNull && !isUndefined ? String(value) : ''
      let newOption = {
        value: value,
        currentLabel: label
      }
      if (this.multiple) {
        newOption.hitState = false
      }
      return newOption
    },
    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value)
        if (option.created) {
          this.createdLabel = option.currentLabel
          this.createdSelected = true
        } else {
          this.createdSelected = false
        }
        this.selectedLabel = option.currentLabel
        this.selected = option
        if (this.filterable) this.query = this.selectedLabel
        return
      }
      let result = []
      if (Array.isArray(this.value)) {
        this.value.forEach((value) => {
          result.push(this.getOption(value))
        })
      }
      this.selected = result
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },
    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected)
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(
              null,
              this.selected.map((item) => this.options.indexOf(item))
            )
          } else {
            this.hoverIndex = -1
          }
        }
      }, 300)
    }
  },
  computed: {
    debounce() {
      return this.remote ? 300 : 0
    },
    propPlaceholder() {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : this.t('y.select.placeholder')
    },
    sizeClass() {
      return this.size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
    },
    selectDisabled() {
      return this.disabled || (this.yForm || {}).disabled
    },
    readonly() {
      return !this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible)
    },
    collapseTagSize() {
      return ['small', 'mini'].includes(this.sizeClass) ? 'mini' : 'small'
    },
    iconClass() {
      return this.remote && this.filterable ? '' : this.visible ? 'arrow-up is-reverse' : 'arrow-up'
    },
    showNewOption() {
      let hasExistingOption = this.options
        .filter((option) => !option.created)
        .some((option) => option.currentLabel === this.query)
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption
    },
    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('y.select.loading')
      } else {
        if (this.remote && this.query === '' && this.options.length === 0) return false
        if (this.filterable && this.query && this.options.length > 0 && this.filteredOptionsCount === 0) {
          return this.noMatchText || this.t('y.select.noMatch')
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t('y.select.noData')
        }
      }
      return null
    },
    showClose() {
      let hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== ''
      let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue
      return criteria
    }
  },
  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },
    propPlaceholder(val) {
      this.initialPlaceHolder = this.currentPlaceholder = val
    },
    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight()
        if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
          this.currentPlaceholder = ''
        } else {
          this.currentPlaceholder = this.initialPlaceHolder
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = ''
          this.onQueryChange(this.query)
        }
      }
      this.setSelected()
      if (this.filterable && !this.multiple) {
        this.inputLength = 20
      }
      if (!valueEquals(val, oldVal)) {
        this.dispatch('YFormItem', 'y.form.change', val)
      }
    },
    visible(val) {
      if (!val) {
        this.broadcast('YSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        this.query = ''
        this.previousQuery = null
        this.selectedLabel = ''
        this.inputLength = 20
        this.menuVisibleOnFocus = false
        this.resetHoverIndex()
        this.$nextTick(() => {
          if (this.$refs.input && this.$refs.input.value === '' && this.selected.length === 0) {
            this.currentPlaceholder = this.initialPlaceHolder
          }
        })
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate && this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel
            } else {
              this.selectedLabel = this.selected.currentLabel
            }
            if (this.filterable) this.query = this.selectedLabel
          }
          if (this.filterable) {
            this.currentPlaceholder = this.initialPlaceHolder
          }
        }
      } else {
        this.broadcast('YSelectDropdown', 'updatePopper')
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel
          this.onQueryChange(this.query)
          if (this.multiple) {
            this.$refs.input.focus()
          } else {
            if (!this.remote) {
              this.broadcast('YOption', 'queryChange', '')
              this.broadcast('YOptionGroup', 'queryChange')
            }
            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel
              this.selectedLabel = ''
            }
          }
        }
      }
      this.$emit('visible-change', val)
    },
    options() {
      if (this.$isServer) return
      this.$nextTick(() => {
        this.broadcast('YSelectDropdown', 'updatePopper')
      })
      if (this.multiple) {
        this.resetInputHeight()
      }
      let inputs = this.$el.querySelectorAll('input')
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected()
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption()
      }
    }
  },
  created() {
    this.initialPlaceHolder = this.currentPlaceholder = this.propPlaceholder
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', [])
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '')
    }
    this.debouncedOnQueryChange = debounce(this.debounce, (e) => {
      this.onQueryChange(e.target.value)
    })
    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange()
    })
    this.$on('handleOptionClick', this.handleOptionClick)
    this.$on('setSelected', this.setSelected)
  },
  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = ''
    }
    addResizeListener(this.$el, this.handleResize)
    const reference = this.$refs.reference
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      }
      const input = reference.$el.querySelector('input')
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize]
    }
    if (this.remote && this.multiple) {
      this.resetInputHeight()
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize)
  }
}
</script>
