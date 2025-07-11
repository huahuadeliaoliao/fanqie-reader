// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: '/dashboard',
        name: 'DashboardRedirect',
        redirect: '/',
      },
      {
        path: '/novels',
        name: 'Novels',
        component: () => import('../views/NovelsView.vue'),
      },
      {
        path: '/novel/:novelId',
        name: 'NovelDetail',
        component: () => import('../views/NovelDetailView.vue'),
        props: (route) => ({
          novelId: route.params.novelId as string,
        }),
      },
      {
        path: '/novel/:novelId/chapter/:chapterId',
        name: 'ChapterDetail',
        component: () => import('../views/ChapterView.vue'),
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/SearchView.vue'),
      },
      {
        path: '/upload',
        name: 'Upload',
        component: () => import('../views/UploadView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tasks',
        name: 'Tasks',
        component: () => import('../views/TasksView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/AuthView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 检查路由是否需要身份验证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果未登录，重定向到登录页
    if (!authStore.isAuthenticated) {
      next({
        path: '/auth',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
