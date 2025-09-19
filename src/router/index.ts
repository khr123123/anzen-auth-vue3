import { createRouter, createWebHistory, type RouteRecordRaw, type RouteLocationNormalized } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/layout/index.vue'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

// 路由配置
const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: '登录',
        component: Login,
        meta: { title: '登录' },
    },
    {
        path: '/',
        component: Layout,
        name: 'Layout',
        redirect: '/index',
        children: [
            {
                path: 'index', // 注意：子路由 path 不要加 `/`
                name: '首页',
                component: Home,
                meta: { title: '首页' },
            },
            {
                path: 'about',
                name: '关于',
                component: About,
                meta: { title: '关于' },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(): { top: number } {
        return { top: 0 } // 路由滚动行为
    },
})

// 全局后置钩子设置标题
router.afterEach((to: RouteLocationNormalized) => {
    document.title = import.meta.env.VITE_TILTE as string
    if (to.meta?.title) {
        document.title += ' - ' + to.meta.title
    }
})

export default router
