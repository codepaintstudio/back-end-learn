import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/', component: () => import('@/views/layout/LayoutContainer.vue'),
    }
  ],
})

export default router

router.beforeEach((to) => {
  const tokenStore = useTokenStore()
  // 未登录且不是去登录页，重定向到登录页
  if (!tokenStore.token && to.path !== '/login') {
    return { path: '/login' }
  }

})
