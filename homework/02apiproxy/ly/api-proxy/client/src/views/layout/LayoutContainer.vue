<script setup>
import { CircleClose, Position } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/user'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import ChatContent from '@/views/article/ChatContent.vue'
import { getUserInfo } from '@/api/chat'
import { onMounted, ref } from 'vue'

const tokenStore = useTokenStore()
const inputText = ref('')
const chatMessage = ref('')
const chatContent = ref(null)
const userInfo = ref({})

// 获取用户信息
const getUser = async () => {
  const res = await getUserInfo()
  userInfo.value = res.data.data.username
  // console.log(res.data.data.username)
}
// 一进页面就获取用户信息
onMounted(() => {
  getUser()
})
// 发送消息
const sendMessage = () => {
  chatMessage.value= inputText.value
  inputText.value = ''
  // chatContent.value.sendChatRequest()
}
const logout = () => {
  tokenStore.removeToken()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px">
        <div class="title">Ollama Chat</div>
        <div class="content">
          <div class="item">
            <div class="icon"></div>
            <p>{{ userInfo }}</p>
          </div>
          <div>
            <el-button type="primary" @click="logout">
              <el-icon>
                <CircleClose />
              </el-icon> 退出</el-button>
          </div>
        </div>
        <div class="footer">
          <!-- // 因为只有一个模型，所以这里直接写死 -->
          模型:gemma3:4b
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div class="title">Ollama Chat</div>
        </el-header>
        <el-main>
          <ChatContent :chatMessage="chatMessage" ref="chatContent"></ChatContent>
          <!-- <router-view ref="chatContent"></router-view> -->
        </el-main>
        <el-footer>
          <input type="text" v-model="inputText" placeholder="请输入内容">
          <el-button class="send-btn" type="primary" @click="sendMessage">
            <el-icon>
              <Position />
            </el-icon>
            发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 98vh;
  width: 100%;
  background-color: #fff;
}

.el-aside {
  position: sticky;
  top: 0;
  height: 98vh;
  /* width: 279px; */
  background-color: rgb(243, 244, 246);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* border-right: 1px solid #ccc; */
}

.el-aside .title {

  width: 280px;
  height: 100px;
  line-height: 100px;
  padding-left: 20px;
  font-size: 30px;
  font-weight: bold;
  color: rgb(22, 22, 23);
  border-bottom: 1px solid #ccc;
}

.el-aside .content {
  /* display: flex; */
  height: 150px;
  width: 280px;
  padding-left: 20px;
  /* background: pink; */
  border-bottom: 1px solid #ccc;

}

.el-aside .content .item {
  display: flex;
  align-items: center;
  height: 80px;
  padding-top: 20px;
  /* margin-top: 20px; */
  line-height: 100px;

}

.el-aside .content .item .icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
  background: url('../../assets/1.png') no-repeat center / 140px auto;
  border-radius: 50%;
  border: 2px solid #fff;

}

.el-aside .content .item p {
  margin-left: 20px;
  height: 100px;
  line-height: 100px;
  font-size: 40px;
  font-weight: bold;
  color: rgb(22, 22, 23);
}

.el-aside .content .el-button {
  width: 240px;
  height: 40px;
  border-radius: 10px;
}

.el-aside .footer {
  height: 50px;
  padding-left: 20px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: rgb(22, 22, 23);
}
.el-header {
  position: sticky;
  top: 0;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  font-size: 30px;
  font-weight: bold;
  color: rgb(22, 22, 23);
  background-color: rgb(243, 244, 246);
}
.el-main {
  /* height: 50vh; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
  width: 100%;
  padding-left: 200px;
  padding-right: 200px;
  /* height: 20vh; */
  /* background-color:black; */
}
.el-footer {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  margin: 0 auto;
    /* padding-left: 200px; */
    /* padding-right: 200px; */
  height: 10vh;
  /* width: 975px; */
  width: 71.5%;
  position: sticky;
  bottom: 0;
  background-color: rgb(243, 244, 246);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.el-footer input {
  padding-left: 10px;
  margin-left: 20px;
  width: 800px;
  height: 50px;
  border-radius: 10px;
  outline: none;
}
.send-btn {
  margin-left: 20px;
  height: 50px;
  width: 100px;
  border-radius: 10px;
}
.send-btn .el-icon {
  font-size: 20px;
  padding-right: 5px;
}

</style>
