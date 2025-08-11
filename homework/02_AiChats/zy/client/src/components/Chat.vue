<template>
    <div class="chat-container">
        <div class="messages">
            <div
                v-for="(message, index) in messages"
                :key="index"
                :class="['message', message.sender]"
            >
                {{ message.text }}
            </div>
        </div>
        <div class="input-area">
            <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type your message..."
            />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
import { io } from 'socket.io-client'

export default {
    name: 'Chat',
    data() {
        return {
            socket: null,
            messages: [],
            newMessage: ''
        }
    },
    created() {
        this.socket = io('http://localhost:5173')

        this.socket.on('chat message', (data) => {
            this.messages.push({
                text: data.user,
                sender: 'user'
            })
            this.messages.push({
                text: data.ai,
                sender: 'ai'
            })
            this.waitingForAI = false
        })
    },
    methods: {
        async sendMessage() {
            if (this.newMessage.trim() === '') return

            this.messages.push({
                text: this.newMessage,
                sender: 'user'
            })

            try {
                const response = await fetch('http://localhost:3000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({ message: this.newMessage })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                this.messages.push({
                    text: data.response,
                    sender: 'ai'
                })
            } catch (error) {
                console.error('Error:', error)
                this.messages.push({
                    text: 'AI服务暂时不可用: ' + error.message,
                    sender: 'ai'
                })
            }

            this.newMessage = ''
        }
    }
}
</script>

<style scoped>
.chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
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
</style>
