import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Layout 组件
const MainLayout = () => import('@/layout/index.vue')
// 页面组件
const Home = () => import('@/views/Home.vue')
const About = () => import('@/views/About.vue')

const Login = () => import('@/views/Login.vue')

// const UserList = () => import('@/views/UserList.vue')
// const UserRole = () => import('@/views/UserRole.vue')
// const Settings = () => import('@/views/Settings.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainLayout, // Layout 作为父级路由
        children: [
            { path: '', component: Home },       // 默认首页
            { path: 'about', component: About }, // /about 页面


            // { path: 'user/list', component: UserList },
            // { path: 'user/role', component: UserRole },
            // { path: 'settings', component: Settings },
        ],
    },
    { path: '/login', component: Login }, // /about 页面
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
