<template>
    <div class="chat-container">
        <div class="messages">
            <div
                v-for="(message, index) in messages"
                :key="index"
                :class="['message', message.sender]"
            >
                <div v-html="renderMarkdown(message.text)"></div>
                <button
                    v-if="message.showCopyButton"
                    @click="copyAi(message.text)"
                    class="hoverCopy"
                >
                    复制
                </button>
            </div>
        </div>
        <div class="input-area">
            <textInput
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type your message..."
            />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
import textInput from './text.vue'
import { marked } from 'marked'
export default {
    name: 'Chat',
    components: {
        textInput
    },
    data() {
        return {
            socket: null,
            messages: [],
            newMessage: ''
        }
    },

    methods: {
        async sendMessage() {
            if (this.newMessage.trim() === '') return
            console.log(localStorage)
            this.messages.push({
                text: this.newMessage,
                sender: 'user'
            })
            console.log(localStorage.getItem('token'))
            try {
                const response = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}` // 从本地存储获取Token
                    },

                    body: JSON.stringify({ message: this.newMessage })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                this.messages.push({
                    text: data.response,
                    sender: 'ai',
                    showCopyButton: true
                })
                console.log('当前输入是', this.newMessage)
            } catch (error) {
                console.error('Error:', error)
                this.messages.push({
                    text: 'AI服务暂时不可用: ' + error.message,
                    sender: 'ai'
                })
            }
            // this.testDatabase()
            this.newMessage = ''
        },
        renderMarkdown(text) {
            return marked.parse(text)
        },
        async copyAi(text) {
            try {
                await navigator.clipboard.writeText(text)
                console.log('已复制文本内容')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style scoped>
/* 添加Markdown渲染样式 */
.markdown-content {
    pre {
        background: #f5f5f5;
        padding: 1em;
        border-radius: 4px;
    }
    code {
        background: #f5f5f5;
        padding: 0.2em 0.4em;
        border-radius: 3px;
    }
}

.chat-container {
    max-width: 600px;
    height: 70%;
    margin: 0 auto;
    /* padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px; */
}

.messages {
    height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.message {
    margin: 10px 0;
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 70%;
}

.user {
    background-color: #007bff;
    color: white;
    margin-left: auto;
}

.ai {
    background-color: #e9ecef;
    color: black;
    margin-right: auto;
}

.input-area {
    display: flex;
    gap: 10px;
    height: 400px;
}

input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.hoverCopy:hover {
    background-color: rgb(47, 222, 157);
}
</style>
