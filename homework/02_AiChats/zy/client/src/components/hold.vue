<template>
    <el-container style="height: 100vh">
        <!-- 可收缩的侧边栏 -->
        <el-aside
            :width="isCollapse ? '64px' : '200px'"
            style="background: #545c64; transition: width 0.3s"
        >
            <div style="height: 60px; display: flex; align-items: center; justify-content: center">
                <el-button @click="isCollapse = !isCollapse" type="text" style="color: white">
                    <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                </el-button>
            </div>
            <el-menu
                :collapse="isCollapse"
                default-active="1"
                background-color="#545c64"
                text-color="#fff"
                :collapse-transition="false"
            >
                <el-menu-item index="1">
                    <i class="el-icon-menu">
                        用户
                        <a v-if="isLoggedIn">{{ loginForm.username }}</a>
                        <a v-if="!isLoggedIn">{{ '未登录' }}</a>
                    </i>
                    <!-- <span v-if="!isCollapse">1</span> -->
                </el-menu-item>
                <el-menu-item index="1" v-if="isLoggedIn" @click="handleLogout">
                    <i class="el-icon-menu"></i>
                    <span>退出登录</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-container>
            <!-- 顶部栏（在侧边栏层级下方） -->
            <el-header style="background: #409eff; display: flex; align-items: center; z-index: 1">
                <span style="color: white">ollama聊天</span>
            </el-header>

            <!-- 主内容区 -->
            <el-main style="padding: 20px; overflow: auto">
                <div v-if="!isLoggedIn" class="login-container">
                    <input
                        v-model="loginForm.username"
                        class="login-input"
                        placeholder="请输入用户名"
                    />
                    <input
                        v-model="loginForm.password"
                        class="login-input"
                        type="password"
                        placeholder="请输入密码"
                    />
                    <button @click="handleLogin" class="login-button">登录</button>
                    <button @click="handleRegister" class="login-button">一键注册</button>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    <p v-if="isregister" class="error-message">注册成功，点击登录</p>
                </div>
                <div class="chat-container" v-if="isLoggedIn">
                    <Chat />
                </div>
                <!-- <div class="text-container">
                    <text1 />
                </div> -->
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import Chat from './Chat.vue'
// import text1 from './text.vue'
export default {
    name: 'Hold',
    components: {
        Chat
        // text1
    },
    setup() {
        const isCollapse = ref(false)
        const isLoggedIn = ref(false)
        const isregister = ref(false)
        const errorMessage = ref('')
        const loginForm = ref({
            username: '',
            password: ''
        })

        const handleLogin = async () => {
            if (!loginForm.value.username || !loginForm.value.password) {
                errorMessage.value = '用户名和密码不能为空'
                return
            }
            console.log('点击了登录')
            try {
                const response = await axios.post('http://localhost:3000/api/login', {
                    username: loginForm.value.username,
                    password: loginForm.value.password
                })

                if (response.data.success) {
                    isLoggedIn.value = true
                    errorMessage.value = ''
                } else {
                    errorMessage.value = response.data.message || '登录失败'
                }
            } catch (error) {
                console.error('登录错误:', error)
                errorMessage.value = '登录失败，请检查网络连接'
            }
        }
        const handleLogout = () => {
            isLoggedIn.value = false
        }
        const handleRegister = async () => {
            if (!loginForm.value.username || !loginForm.value.password) {
                errorMessage.value = '用户名和密码不能为空'
                return
            }
            try {
                const response = await axios.post('http://localhost:3000/api/save', {
                    username: loginForm.value.username,
                    password: loginForm.value.password
                })
                if (response.data.success) {
                    isLoggedIn.value = true
                    errorMessage.value = ''
                } else if (response.data.status == '409') {
                    errorMessage.value = '用户名已存在'
                } else {
                    errorMessage.value = response.data.message || '登录失败'
                }
            } catch (error) {
                console.error('登录错误:', error)
                errorMessage.value = '登录失败，请检查网络连接'
            }
        }
        return {
            isCollapse,
            isLoggedIn,
            loginForm,
            errorMessage,
            handleLogin,
            handleLogout,
            handleRegister
        }
    }
}
</script>

<style scoped>
.el-menu {
    border-right: none;
}
.el-menu-item i {
    margin-right: 5px;
}
.chat-container {
    width: 100%;
    height: 100%;
    /* background-color: aqua; */
}
.login-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    max-width: 300px;
    margin: 0 auto;
}

.login-input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.login-button {
    padding: 10px;
    background: #4c9fae;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login-button:hover {
    background: #60cd7f;
}
.error-message {
    color: red;
    margin-top: 10px;
    text-align: center;
}
/* .text-container {
    width: 600px;
    height: 400px;
    border: 5px solid #4c9fae;
} */
</style>
