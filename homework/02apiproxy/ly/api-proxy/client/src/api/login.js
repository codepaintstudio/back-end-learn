import instance from '@/utils/requst'
// 登录
export const userlogin = (data) =>  instance.post('/api/login', data)

// 注册
export const userregister = (data) => instance.post('/api/register', data)

