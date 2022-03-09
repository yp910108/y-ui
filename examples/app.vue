<template>
  <div class="app">
    <y-popover
      placement="top-start"
      title="标题"
      width="200"
      trigger="hover"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    >
      <y-button slot="reference">hover 激活</y-button>
    </y-popover>

    <y-popover
      placement="bottom"
      title="标题"
      width="200"
      trigger="click"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    >
      <y-button slot="reference">click 激活</y-button>
    </y-popover>

    <y-popover
      ref="popover"
      placement="right"
      title="标题"
      width="200"
      trigger="focus"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    >
    </y-popover>
    <y-button v-popover:popover>focus 激活</y-button>

    <y-popover
      v-model="visible"
      placement="bottom"
      title="标题"
      width="200"
      trigger="manual"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    >
      <y-button slot="reference" @click="visible = !visible">手动激活</y-button>
    </y-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  }
}
</script>
