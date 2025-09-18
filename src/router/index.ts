// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
// import UserList from '@/views/UserList.vue'
// import UserRole from '@/views/UserRole.vue'
// import Settings from '@/views/Settings.vue'
import About from '@/views/About.vue'

const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    // { path: '/user/list', component: UserList },
    // { path: '/user/role', component: UserRole },
    // { path: '/settings', component: Settings },
    { path: '/about', component: About },

]

export default createRouter({
    history: createWebHistory(),
    routes
})
