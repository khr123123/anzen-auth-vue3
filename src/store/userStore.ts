import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'anzen_user'

export interface UserInfo {
    id: number | string
    username: string
    nickname?: string
    avatar?: string
    roles: string[]
    permissions: string[]
}

export const useUserStore = defineStore('user', () => {
    const user = ref<UserInfo | null>(null)

    function setUser(info: UserInfo) {
        user.value = info
        persist()
    }

    function clearUser() {
        user.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    function persist() {
        if (user.value) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
        }
    }

    function initFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                user.value = JSON.parse(raw)
            }
        } catch (e) {
            console.warn('restore user failed', e)
        }
    }

    function hasRole(role: string): boolean {
        return user.value?.roles?.includes(role) ?? false
    }

    function hasPermission(permission: string): boolean {
        return user.value?.permissions?.includes(permission) ?? false
    }

    // 初始化时恢复
    initFromStorage()

    return {
        user,
        setUser,
        clearUser,
        hasRole,
        hasPermission,
    }
})
