<template>
    <a-layout style="min-height: 100vh">
        <!-- 顶部 Header -->
        <a-layout-header class="app-header">
            <header class="header" role="banner">
                <img src="@/assets/logo.png" alt="ANZEN logo" class="logo" />
                <div class="header-text">ANZEN</div>
            </header>

            <a-menu :mode="'horizontal'" :selected-keys="[route.path]" @menu-item-click="handleTopMenuClick" style="border-bottom: 1px solid var(--color-border);  border-radius: 8px;   box-shadow: 0 2px 6px rgba(0,0,0,0.03); 
margin-left:24px;margin-right:24px;">
                <a-menu-item key="/index">Home</a-menu-item>
                <a-menu-item key="/about">About</a-menu-item>
            </a-menu>
            <!-- 顶部操作区 -->
            <div style="display:flex; align-items:center; gap:12px;">
                <!-- GitHub 按钮 -->
                <a-button type="text" @click="goGithub">
                    <template #icon>
                        <IconGithub size="20px" />
                    </template>
                </a-button>
                <!-- 主题切换 -->
                <a-button type="text" @click="toggleTheme" title="切换主题">
                    <template #icon>
                        <IconMoon v-if="isDark" size="20px" />
                        <IconSun v-else size="20px" />
                    </template></a-button>

                <!-- 用户头像下拉 -->
                <a-dropdown trigger="click">
                    <a-avatar :size="45" style="cursor:pointer">
                        <template v-if="user?.avatar && isValidUrl(user?.avatar)">
                            <img :src="user?.avatar" alt="avatar" />
                        </template>
                        <template v-else>
                            {{ user?.name ? user?.name.charAt(0).toUpperCase() : "U" }}
                        </template>
                    </a-avatar>
                    <template #content>
                        <a-doption @click="goProfile">
                            <template #icon><icon-user /></template>
                            个人信息
                        </a-doption>
                        <a-doption @click="handleLogout">
                            <template #icon><icon-export /></template>
                            退出登录
                        </a-doption>
                    </template>
                </a-dropdown>
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
                        <!-- 1. 不含外链接 -->
                        <!--
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
                        -->
                        <!-- 2. 含外链接 -->
                        <template v-for="menu in menuList">
                            <!-- 如果是外链 -->
                            <a-menu-item v-if="menu.url && menu.url.startsWith('http')" :key="menu.url">
                                <template #icon>
                                    <component :is="getIconComponent(menu.icon)" style="font-size: 20px;" />
                                </template>
                                <a :href="menu.url" target="_blank">{{ menu.menuName }}</a>
                            </a-menu-item>
                            <!-- 如果有子菜单 -->
                            <a-sub-menu v-else :key="menu.url">
                                <template #icon>
                                    <component :is="getIconComponent(menu.icon)" style="font-size: 20px;" />
                                </template>
                                <template #title>{{ menu.menuName }}</template>
                                <!-- 子菜单循环 -->
                                <a-menu-item v-for="item in menu.children" :key="item.url">
                                    <template #icon>
                                        <component :is="getIconComponent(item.icon)" style="font-size: 20px;" />
                                    </template>
                                    <!-- 子菜单外链 or 内链 -->
                                    <template v-if="item.url && item.url.startsWith('http')">
                                        <a :href="item.url" target="_blank">{{ item.menuName }}</a>
                                    </template>
                                    <template v-else>
                                        {{ item.menuName }}
                                    </template>
                                </a-menu-item>
                            </a-sub-menu>
                        </template>
                    </a-menu>
                </div>
            </a-layout-sider>

            <a-layout-content class="content">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore, type MenuItem } from '@/store/menuStore'
import * as ArcoIcons from '@arco-design/web-vue/es/icon'
import { getMenuInfo } from '@/api/sysMenuController'
import { getRoleInfo } from '@/api/sysRoleController'
import { getUserRouters } from '@/api/sysUserController'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/store/userStore'
import { useTokenStore } from '@/store/tokenStore'


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

const menuList = ref<any[]>([])

const fetchMenuList = async () => {
    try {
        const menuRes = await getUserRouters()
        if (menuRes.code === 0) {
            menuStore.setMenus(menuRes.data) // 构建树并存储
        }
    } catch (error) {
        console.error('获取菜单失败', error)
    }
}
onMounted(() => {
    if (!menuStore.treeMenus || menuStore.treeMenus.length === 0) {
        // 如果 store 里没有数据，就去拉取
        fetchMenuList()
        menuList.value = menuStore.treeMenus
    } else {
        // 有数据直接用
        menuList.value = menuStore.treeMenus
    }
})

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

const userStore = useUserStore();
const tokenStore = useTokenStore()
const user = computed(() => userStore.userInfo?.user || null)

/** 校验是否完整 URL */
const isValidUrl = (url: string): boolean => {
    try {
        return Boolean(new URL(url));
    } catch {
        return false;
    }
};

/** GitHub 跳转 */
const goGithub = () => {
    window.open("https://github.com/khr123123", "_blank");
};

/** 主题切换（简单示例） */
const isDark = ref(false);
const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.body.setAttribute("arco-theme", isDark.value ? "dark" : "light");
};

/** 个人信息 */
const goProfile = () => {
    router.push("/profile");
};

/** 退出登录 */
const handleLogout = () => {
    userStore.clearUser();
    tokenStore.clearToken();
    menuStore.clearMenus();
    Message.success("已退出登录");
    router.replace("/login");
};
</script>

<style scoped>
.menu-sider {
    box-sizing: border-box;
    width: 100%;
    height: calc(100vh - 64px);
    background-color: var(--color-bg-1);
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 260px;
    padding: 6px 10px;
    border-radius: 8px;
    backdrop-filter: blur(6px);
    background-color: var(--color-bg-2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
}

.logo {
    margin-left: 20px;
    width: 56px;
    height: 46px;
    object-fit: contain;
}

.header-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-1);
    letter-spacing: 1px;
}

.app-header {
    display: flex;
    align-items: center;
    padding: 0 20px 0 0;
    height: 64px;
    background: var(--color-bg-1);
}

.content {
    background: var(--color-bg-1);
    padding: 12px 24px;
}
</style>
