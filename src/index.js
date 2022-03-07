/* Automatically generated by './build/bin/build-entry.js' */

import locale from './locale'
import Aside from '../packages/aside'
import Button from '../packages/button'
import ButtonGroup from '../packages/button-group'
import Cascader from '../packages/cascader'
import CascaderPanel from '../packages/cascader-panel'
import Checkbox from '../packages/checkbox'
import CheckboxButton from '../packages/checkbox-button'
import CheckboxGroup from '../packages/checkbox-group'
import Col from '../packages/col'
import Container from '../packages/container'
import DatePicker from '../packages/date-picker'
import Footer from '../packages/footer'
import Form from '../packages/form'
import FormItem from '../packages/form-item'
import Header from '../packages/header'
import Icon from '../packages/icon'
import Input from '../packages/input'
import InputNumber from '../packages/input-number'
import Link from '../packages/link'
import Main from '../packages/main'
import Option from '../packages/option'
import OptionGroup from '../packages/option-group'
import Progress from '../packages/progress'
import Radio from '../packages/radio'
import RadioButton from '../packages/radio-button'
import RadioGroup from '../packages/radio-group'
import Row from '../packages/row'
import Scrollbar from '../packages/scrollbar'
import Select from '../packages/select'
import Slider from '../packages/slider'
import Switch from '../packages/switch'
import Tag from '../packages/tag'
import TimePicker from '../packages/time-picker'
import TimeSelect from '../packages/time-select'
import Tooltip from '../packages/tooltip'

const components = [
  Aside,
  Button,
  ButtonGroup,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Container,
  DatePicker,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Input,
  InputNumber,
  Link,
  Main,
  Option,
  OptionGroup,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Row,
  Scrollbar,
  Select,
  Slider,
  Switch,
  Tag,
  TimePicker,
  TimeSelect,
  Tooltip
]

const install = function (Vue, opts = {}) {
  locale.use(opts.locale)
  locale.i18n(opts.i18n)

  components.forEach((component) => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$YUI = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '2.15.6',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  Aside,
  Button,
  ButtonGroup,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Container,
  DatePicker,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Input,
  InputNumber,
  Link,
  Main,
  Option,
  OptionGroup,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Row,
  Scrollbar,
  Select,
  Slider,
  Switch,
  Tag,
  TimePicker,
  TimeSelect,
  Tooltip
}
