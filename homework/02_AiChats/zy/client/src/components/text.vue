<template>
    <div style="border: 1px solid #ccc">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 500px; overflow-y: hidden"
            :value="modelValue"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="handleChange"
        />
    </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    components: { Editor, Toolbar },
    props: {
        modelValue: {
            // 用于v-model的标准prop
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const editorRef = shallowRef()
        const toolbarConfig = {}
        const editorConfig = { placeholder: '请输入内容...' }

        const handleCreated = (editor) => {
            editorRef.value = editor
        }

        // 添加内容变化处理
        const handleChange = (editor) => {
            const html = editor.getHtml()
            emit('update:modelValue', html) // 触发v-model更新
        }

        onBeforeUnmount(() => {
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })

        return {
            editorRef,
            mode: 'default',
            toolbarConfig,
            editorConfig,
            handleCreated,
            handleChange
        }
    }
}
</script>
