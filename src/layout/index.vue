<template>
    <a-layout style="min-height: 100vh">
        <!-- 顶部菜单栏 -->
        <a-layout-header style="display: flex; align-items: center; background: #fff; padding: 4px 24px;">
            <!-- Logo -->
            <div @click="router.push('/')" :style="{
                width: '80px',
                height: '38px',
                backgroundImage: `url(${logo})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                cursor: 'pointer',
            }" />

            <a-menu mode="horizontal" :default-selected-keys="['/']" @menu-item-click="handleMenuClick">
                <a-menu-item key="/">Home</a-menu-item>
                <a-menu-item key="/solution">Solution</a-menu-item>
                <a-menu-item key="/cloud">Cloud Service</a-menu-item>
                <a-menu-item key="/about">About</a-menu-item>
            </a-menu>
        </a-layout-header>



        <a-layout-content style="background: #fff;">
            <router-view />
        </a-layout-content>
        <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
const router = useRouter()

const menuItems = ref([
    { key: '/', label: '首页' },
    { key: '/user/list', label: '用户管理' },
    { key: '/settings', label: '设置' },
])

const handleMenuClick = (key: string) => router.push(key)
</script>

<style scoped></style>
