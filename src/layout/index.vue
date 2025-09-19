<template>
    <a-layout style="min-height: 100vh">
        <!-- 顶部 Header -->
        <a-layout-header style="display:flex; align-items:center; background:#fff; padding:0 24px; height:64px;">
            <header class="header" role="banner">
                <img src="@/assets/logo.png" alt="ANZEN logo" class="logo" />
                <div class="header-text">ANZEN</div>
            </header>

            <a-menu mode="horizontal" :default-selected-keys="['/']" @menu-item-click="handleTopMenuClick"
                style="margin-left:24px">
                <a-menu-item key="/">Home</a-menu-item>
                <a-menu-item key="/about">About</a-menu-item>
            </a-menu>

            <div style="margin-right:12px">
                <a-avatar :size="45">A</a-avatar>
            </div>
        </a-layout-header>

        <!-- 主体布局 -->
        <a-layout>
            <!-- 侧边栏 -->
            <a-layout-sider :collapsed="collapsed" :show-collapse-button="true" breakpoint="xl" @collapse="onCollapse">
                <div class="menu-sider">
                    <a-menu :default-selected-keys="[defaultActive]" :style="{ width: '200px', height: '100%' }"
                        @menu-item-click="handleMenuClick">
                        <!-- 动态菜单 -->
                        <a-sub-menu v-for="menu in menuList" :key="menu.url">
                            <template #icon>
                                <component :is="getIconComponent(menu.icon)" style="font-size: 20px;" />
                            </template>
                            <template #title>{{ menu.menuName }}</template>

                            <a-menu-item v-for="item in menu.children" :key="item.url">
                                <template #icon>
                                    <component :is="getIconComponent(item.icon)" style="font-size: 20px;" />
                                </template>
                                {{ item.menuName }}
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </div>
            </a-layout-sider>

            <a-layout-content style="background:#fff; padding:16px;">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore, type MenuItem } from '@/store/menuStore'
import * as ArcoIcons from '@arco-design/web-vue/es/icon'


const router = useRouter()
const route = useRoute()

const menuStore = useMenuStore()

const collapsed = ref(false)
// 获取图标组件
const getIconComponent = (name: string) => {
    return (ArcoIcons as Record<string, any>)['Icon' + name] || undefined
}

// 顶部菜单点击
const handleTopMenuClick = (key: string) => router.push(key)

const menuList = ref(menuStore.treeMenus)

// 默认高亮项 = 当前路由 path
const defaultActive = computed(() => route.path)

// 点击菜单（自动跳转）
const handleMenuClick = (key: string) => {
    console.log(router.getRoutes());
    router.replace(key)
}
// 折叠回调
const onCollapse = (val: boolean, type: 'clickTrigger' | 'responsive') => {
    collapsed.value = val
}
</script>

<style scoped>
.menu-sider {
    box-sizing: border-box;
    width: 100%;
    height: calc(100vh - 64px);
    background-color: var(--color-neutral-2);
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.01);
}

.logo {
    width: 50px;
    height: 44px;
    object-fit: contain;
}

.header-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-1, #165fdd);
    letter-spacing: 1px;
}
</style>
