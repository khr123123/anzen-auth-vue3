<template>
  <a-layout style="height: 100vh">
    <!-- 顶部导航栏 -->
    <a-layout-header class="flex items-center justify-between">
      <!-- 菜单，支持子菜单 -->
      <a-menu mode="horizontal" :selected-keys="[activeKey]" @menu-item-click="handleMenuClick" class="flex-1 ml-6">
        <template v-for="item in menuList" :key="item.path">
          <a-sub-menu v-if="item.children" :key="item.path">
            <template #title>{{ item.name }}</template>
            <a-menu-item v-for="child in item.children" :key="child.path">
              {{ child.name }}
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item v-else :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </template>
      </a-menu>

      <!-- 右上角用户操作 -->
      <div class="flex items-center space-x-4 text-white">
        <a-button type="text">登录</a-button>
        <a-dropdown>
          <a-button type="text">操作</a-button>
          <template #content>
            <a-doption>设置</a-doption>
            <a-doption>退出</a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <!-- 内容区 -->
    <a-layout-content class="p-4 bg-gray-50">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import type { MenuItem } from '@/types/menu'

const router = useRouter()
const route = useRoute()

// 动态菜单配置
const menuList = [
  { name: '首页', path: '/' },
  {
    name: '用户管理', path: '/user', children: [
      { name: '用户列表', path: '/user/list' },
      { name: '角色管理', path: '/user/role' },
    ]
  },
  { name: '设置', path: '/settings' }
]

// 当前选中的菜单
const activeKey = ref(route.path)

// 点击菜单时路由跳转
const handleMenuClick = (key: string) => {
  activeKey.value = key
  router.push(key)
}
</script>

<style scoped>
.a-layout-header {
  background: #1d1f21;
}
</style>
