<template>
  <div v-if="isCreate" style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
        :defaultConfig="toolbarConfig"
        :editor="editorRef"
        :mode="mode"
        style="border-bottom: 1px solid #ccc;"
    />
    <!-- 编辑器 -->
    <Editor
        :default-content="defaultContent"
        :defaultConfig="editorConfig"
        :mode="mode"
        style="height: 300px"
        @onChange="handleChange"
        @onCreated="handleCreated"
    />
  </div>
</template>
<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {onBeforeUnmount, onMounted, shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const props = defineProps({
  isCreate: Boolean,
  mode: {
    default: 'default',
    type: String,
  },
  defaultContent: {
    default: [],
  },
})
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const emit = defineEmits(["is-full-screen", "get-content-html"])

const getDefaultContent = JSON.parse(JSON.stringify(props.defaultContent));

onMounted(() => {
  editorConfig.MENU_CONF["uploadImage"] = {
    server: '/api/upload',
  }
})

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...', MENU_CONF: {
    insertImage: {
      checkImage(src) {
        console.log('image src', src)
        if (src.indexOf('http') !== 0) {
          return '图片网址必须以 http/https 开头';
        }
        return true;
      },
    },
  },
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器创建
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！

  //全屏时，要关闭 弹框
  editor.on('fullScreen', () => {
    emit('is-full-screen', true)
  })
  //非全屏时，要打开 弹框
  editor.on('unFullScreen', () => {
    emit('is-full-screen', false)
  })
}
//编辑器内容发生改变时，及时获取内容
const handleChange = (editor) => {
  emit('get-content-html', JSON.stringify(editor.children), editor.getHtml())
}
</script>
<style scoped>

</style>