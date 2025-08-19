<script setup>
// import { getModels } from '@/api/chat'
import { ref, watch, computed } from 'vue'
import { useTokenStore } from '@/stores/user'

const tokenStore = useTokenStore()
const modelsList = ref([])// 用户输入
const chatMessages = ref([]);// ai 输出
const Message = ref('')// ai 回答一个问题的存储的数据
// const getModelsList = async () => {
//   const res = await getModels()
//   console.log(res)
// }
// 父传发送的消息
const props = defineProps({
  chatMessage: String
})
// 监听父组件传递的消息，直接调Ai回答问题
watch(() => props.chatMessage, (newVal) => {
  if (newVal) {
    modelsList.value.push({ role: "user", content: newVal, timestamp: Date.now() });
    sendChatRequest()
  }
})
// //
// console.log(modelsList.value)
// console.log(props.chatMessage)

async function sendChatRequest() {
  const model = "gemma3:4b";
  const messages = [
    { role: "user", content: props.chatMessage || "你好"} // 使用 props.chatMessage 作为用户输入
  ];

  try {
    // 发起 POST 请求，获取响应流
    const response = await fetch('http://localhost:3000/chat/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 因为后端加了Bearer，所以这里不加Bearer
        'Authorization': tokenStore.token
      },
      body: JSON.stringify({ model, messages }) // 传入后端需要的参数
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误：${response.status}`);
    }

    // 获取响应体的可读流
    const reader = response.body.getReader();
    // 编码解码器（将二进制流转为文本）
    const decoder = new TextDecoder('utf-8');
    // modelsList.value.push({ role: "assistant" })
    // 循环读取流数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('流已结束');
        break;
      }
      // 将二进制数据解码为文本
      const chunk = decoder.decode(value, { stream: true });
      // 处理每个数据块（注意：可能包含多个 JSON 片段，需按后端格式拆分）
      const lines = chunk.split('\n\n').filter(line => line.trim() !== '');
      lines.forEach(line => {
        try {
          const data = JSON.parse(line);
          if (data.done) {

            console.log('对话完成');

          } else if (data.data?.content) {
            Message.value += data.data.content;
             console.log('收到内容：', data.data.content);
            // 实时更新 UI
          }

        } catch (err) {
          console.error('解析 chunk 失败：', err, '原始数据：', line);
        }
      });
    }
    chatMessages.value.push({ role: 'assistant', content: Message.value, timestamp: Date.now() });
    Message.value = ''
    // modelsList.value.push({ role: "assistant", content: Message.value })
    // chatMessages.value.push({ role: 'assistant', content: Message.value });

  } catch (err) {
    console.error('请求失败：', err);
  }
}
// defineExpose({
//   sendChatRequest
// })
// created() {
//   sendChatRequest()
// }
// const allMessages = computed(() => [
//   ...chatMessages.value,
//   ...modelsList.value
// ])
// 假设每个消息对象都有 timestamp 字段表示发送时间
const allMessages = computed(() => {
  // 合并两个数组
  const combined = [...chatMessages.value, ...modelsList.value];

  // 按时间戳排序，确保消息按发送顺序展示
  return combined.sort((a, b) => {
    // 假设 timestamp 是毫秒级时间戳
    return a.timestamp - b.timestamp;
  });
});

// 调用函数发起请求
// console.log(Message.value)
</script>

<template>

  <div class="chat-content">
    <p v-for="(msg, index) in allMessages" :key="index" :class="msg.role === 'user' ? 'usrchat' : 'aichat'">
      {{ msg.content }}
    </p>
  </div>
</template>
<style scoped>
.chat-content {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 700px;
}

.usrchat {
  color: black;
  align-self: flex-end;
  background-color: rgb(245, 245, 245);
  padding: 15px;
  max-width: 80%;
  border-radius: 5px;
}

.aichat {
  color: black;
  align-self: flex-start;
  background-color: rgb(245, 245, 245);
  padding: 15px;
  max-width: 80%;
  border-radius: 5px;
}
</style>
