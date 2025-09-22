import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'anzen_user'

export interface UserInfo {
    user: any
    roles: string[]
    permissions: string[]
}

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null)
    //节流开关
    const hasRoutes = ref(false)

    function setHasRoutes(value: boolean) {
        hasRoutes.value = value
    }
    function setUser(info: UserInfo) {
        userInfo.value = info
        persist()
    }
    function updateUser(info: any) {
        userInfo.value!.user = { ...userInfo.value!.user, ...info }
        persist()
    }

    function clearUser() {
        userInfo.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    function persist() {
        if (userInfo.value) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo.value))
        }
    }

    function initFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                userInfo.value = JSON.parse(raw)
            }
        } catch (e) {
            console.warn('restore user failed', e)
        }
    }

    function hasRole(role: string): boolean {
        return userInfo.value?.roles?.includes(role) ?? false
    }

    function hasPermission(permission: string): boolean {
        return userInfo.value?.permissions?.includes(permission) ?? false
    }

    // 初始化时恢复
    initFromStorage()

    return {
        userInfo,
        hasRoutes,
        setUser,
        updateUser,
        clearUser,
        hasRole,
        hasPermission,
        setHasRoutes,
    }
})
