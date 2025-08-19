import axios from 'axios'
import { useTokenStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const baseURL = 'http://localhost:3000'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 1000000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const tokenStore = useTokenStore()
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token
    }

    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {

    if (res.data.code === 201) {
      return res
    }

    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {

    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
