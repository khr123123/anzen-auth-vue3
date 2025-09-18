<template>
    <a-menu mode="inline" :selected-keys="[selectedKey]" :default-open-keys="defaultOpenKeys"
        @menu-item-click="handleClick">
        <template v-for="item in menuList" :key="item.menuId">
            <a-sub-menu v-if="item.children && item.children.length" :key="item.url">
                <template #title>{{ item.menuName }}</template>
                <template v-for="child in item.children" :key="child.menuId">
                    <a-menu-item :key="child.url">{{ child.menuName }}</a-menu-item>
                </template>
            </a-sub-menu>
            <a-menu-item v-else :key="item.url">{{ item.menuName }}</a-menu-item>
        </template>
    </a-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 接收外部传入的菜单数据
defineProps<{ menuList: any[] }>()

const router = useRouter()
const route = useRoute()
const selectedKey = ref(route.path)
const defaultOpenKeys = ref<string[]>([])

// 点击菜单跳转
const handleClick = (key: string) => {
    router.push(key)
}

// 监听路由变化，更新菜单选中状态
watch(
    () => route.path,
    (newPath) => {
        selectedKey.value = newPath
    }
)
</script>
