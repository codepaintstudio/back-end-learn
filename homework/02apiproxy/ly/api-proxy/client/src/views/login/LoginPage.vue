<script setup>
import { ref, watch } from 'vue'
import { userlogin, userregister } from '@/api/login'
import router from '@/router/index'
import { useTokenStore } from '@/stores/user'
const tokenStore = useTokenStore()
const ifRegister = ref(true)

const formModel = ref({
  username: '',
  password: ''
})
watch(ifRegister, () => {
  formModel.value.username = ''
  formModel.value.password = ''
})
// 登录
const login = async () => {
  const res = await userlogin(formModel.value)
  // console.log(res)
  // console.log(res.data.data.token)
  if (res.data.code === 201) {
    ElMessage.success('登录成功')
    tokenStore.setToken(res.data.data.token)
     console.log(tokenStore.token)
    router.push('/')

  } else {
    ElMessage.error(res.data.message)
  }
}
// 注册
const register = async () => {
  const res = await userregister(formModel.value)
  // console.log(res)
  // console.log(res.data)
  if (res.data.code === 201) {
    ElMessage.success('注册成功')
  } else {
    ElMessage.error(res.data.message)
  }
}
</script>

<template>

  <!-- 注册 -->
  <div class='content'>
    <div class="box">
      <div class="left-box">
        <img src="../../assets/1.png" alt="">
      </div>
      <div class='right-box'>
        <div class="form" v-if="ifRegister">
          <h1>注册</h1>
          <input v-model="formModel.username" placeholder="请输入用户名"></input>
          <input v-model="formModel.password" placeholder="请输入密码"></input>
          <el-button type="primary" class="button" @click="register">注册</el-button>
          <el-link class="link" :underline="false" @click="ifRegister = false"> ← 去登录</el-link>
        </div>
        <div class="form" v-else>
          <h1>登录</h1>
          <input v-model="formModel.username" placeholder="请输入用户名"></input>
          <input v-model="formModel.password" placeholder="请输入密码"></input>
          <el-button type="primary" class="button" @click="login">登录</el-button>
          <el-link class="link" :underline="false" @click="ifRegister = true"> ← 去注册</el-link>
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>
.content {
  height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  height: 400px;
  width: 800px;
  background: pink;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  display: flex;

}

.box .left-box {
  height: 100%;
  width: 50%;
  background: #f5f5f5;

}

.box .left-box img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 20px 0 0 20px;
}

.box .right-box {
  height: 100%;
  width: 50%;
  background: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  border-radius: 0 20px 20px 0;
}

.box .right-box .form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box .right-box .form input {
  width: 300px;
  height: 40px;
  padding-left: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.box .right-box .form h1 {
  margin-top: 20px;
}

.box .right-box .form .button {
  width: 300px;
  height: 40px;
  border-radius: 10px;
}

.box .right-box .form .link {
  margin-top: 20px;
  margin-left: -250px;
}

.form {
  width: 300px;
}
</style>
