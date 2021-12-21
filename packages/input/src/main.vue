<template>
  <div
    :class="[
      type === 'textarea' ? 'y-textarea' : 'y-input',
      {
        [`y-input--${sizeClass}`]: sizeClass,
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'y-input-group': $slots.prepend || $slots.append,
        'y-input-group--append': $slots.append,
        'y-input-group--prepend': $slots.prepend,
        'y-input--prefix': $slots.prefix || prefixIcon,
        'y-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div v-if="$slots.prepend" class="y-input-group__prepend">
        <slot name="prepend" />
      </div>
      <input
        ref="input"
        v-bind="{
          placeholder: '请输入',
          ...$attrs
        }"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :aria-label="label"
        class="y-input__inner"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <!-- 前置内容 -->
      <span v-if="$slots.prefix || prefixIcon" class="y-input__prefix">
        <slot name="prefix" />
        <i v-if="prefixIcon" :class="`'y-input__icon' ${prefixIcon}`" />
      </span>
      <!-- 后置内容 -->
      <span class="y-input__suffix" v-if="getSuffixVisible()">
        <span class="y-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix" />
            <i class="y-input__icon" v-if="suffixIcon" :class="suffixIcon" />
          </template>
          <i
            v-if="showClear"
            class="y-input__icon y-icon-circle-close y-input__clear"
            @mousedown.prevent
            @click="clear"
          />
          <i v-if="showPwdVisible" class="y-input__icon y-icon-view y-input__clear" @click="handlePasswordVisible" />
          <span v-if="isWordLimitVisible" class="y-input__count">
            <span class="y-input__count-inner">{{ textLength }}/{{ upperLimit }}</span>
          </span>
        </span>
        <i v-if="validateState" :class="['y-input__icon', 'y-input__validateIcon', validateIcon]" />
      </span>
      <!-- 后置元素 -->
      <div v-if="$slots.append" class="y-input-group__append">
        <slot name="append" />
      </div>
    </template>
    <template v-else>
      <textarea
        ref="textarea"
        v-bind="{
          placeholder: '请输入',
          ...$attrs
        }"
        :tabindex="tabindex"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        :aria-label="label"
        :style="textareaStyle"
        class="y-textarea__inner"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <span v-if="isWordLimitVisible" class="y-input__count">{{ textLength }}/{{ upperLimit }}</span>
    </template>
  </div>
</template>

<script>
import emitter from 'main/mixins/emitter'
import Migrating from 'main/mixins/migrating'
import calcTextareaHeight from './calcTextareaHeight'
import merge from 'main/utils/merge'
import { isKorean } from 'main/utils/shared'

export default {
  name: 'YInput',
  inheritAttrs: false,
  mixins: [emitter, Migrating],
  inject: {
    yForm: {
      default: () => ({})
    },
    yFormItem: {
      default: () => ({})
    }
  },
  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
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
            "[Yui Warn][Input]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    clearable: Boolean,
    showPassword: Boolean,
    showWordLimit: Boolean,
    tabindex: String
  },
  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false
    }
  },
  methods: {
    getInput() {
      return this.$refs.input || this.$refs.textarea
    },
    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      )
    },
    focus() {
      this.getInput().focus()
    },
    blur() {
      this.getInput().blur()
    },
    select() {
      this.getInput().select()
    },
    getMigratingConfig() {
      return {
        props: {
          icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          click: 'click is removed.'
        }
      }
    },
    setNativeInputValue() {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    handleCompositionStart() {
      this.isComposing = true
    },
    handleCompositionUpdate(event) {
      const text = event.target.value
      const lastCharacter = text[text.length - 1] || ''
      this.isComposing = !isKorean(lastCharacter)
    },
    handleCompositionEnd(event) {
      if (this.isComposing) {
        this.isComposing = false
        this.handleInput(event)
      }
    },
    handleInput(e) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (e.target.value === this.nativeInputValue) return

      this.$emit('input', e.target.value)

      // hack for https://github.com/ElemeFE/element/issues/12850
      // ensure native input value is controlled
      this.$nextTick(this.setNativeInputValue)
    },
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('YFormItem', 'y.form.blur')
      }
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    resizeTextarea() {
      if (this.$isServer) return
      const { autosize, type } = this
      if (type !== 'textarea') return
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows
      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    calcIconOffset(place) {
      let elList = [].slice.call(this.$el.querySelectorAll(`.y-input__${place}`) || [])
      if (!elList.length) return
      let el = null
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i]
          break
        }
      }
      if (!el) return
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      }

      const pendant = pendantMap[place]
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
          this.$el.querySelector(`.y-input-group__${pendant}`).offsetWidth
        }px)`
      } else {
        el.removeAttribute('style')
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix')
      this.calcIconOffset('suffix')
    },
    clear() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible
      this.$nextTick(() => {
        this.focus()
      })
    }
  },
  computed: {
    validateState() {
      return this.yFormItem ? this.yFormItem.validateState : ''
    },
    needStatusIcon() {
      return this.yForm ? this.yForm.statusIcon : false
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState]
    },
    textareaStyle() {
      return merge(this.textareaCalcStyle, { resize: this.resize })
    },
    sizeClass() {
      return this.size || this.yFormItem.size || this.yForm.size || (this.$YUI || {}).size
    },
    inputDisabled() {
      return this.disabled || this.yForm.disabled
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      )
    },
    showPwdVisible() {
      return this.showPassword && !this.inputDisabled && !this.readonly && (!!this.nativeInputValue || this.focused)
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      )
    },
    upperLimit() {
      return this.$attrs.maxlength
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length
      }
      return (this.value || '').length
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit
    }
  },
  watch: {
    value() {
      this.$nextTick(this.resizeTextarea)
      if (this.validateEvent) {
        this.dispatch('YFormItem', 'y.form.change')
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue()
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue()
        this.resizeTextarea()
        this.updateIconOffset()
      })
    }
  },
  created() {
    this.$on('inputSelect', this.select) // hack for what?
  },
  mounted() {
    this.setNativeInputValue()
    this.resizeTextarea()
    this.updateIconOffset()
  },
  updated() {
    this.$nextTick(this.updateIconOffset)
  }
}
</script>
