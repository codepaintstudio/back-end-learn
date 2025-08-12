import instance from '@/utils/requst'
// 个人信息
export const getUserInfo = () =>  instance.get('/chat/user')

