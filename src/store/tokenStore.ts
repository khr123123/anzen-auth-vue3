import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'anzen_token'

export const useTokenStore = defineStore('token', () => {
    const token = ref<string | null>(null)

    // 是否已登录
    const isLogin = computed(() => !!token.value)

    /** 设置 Token */
    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem(STORAGE_KEY, newToken)
    }

    /** 清除 Token */
    function clearToken() {
        token.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    /** 初始化（从 localStorage 恢复） */
    function initFromStorage() {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            token.value = raw
        }
    }

    // 初始化时尝试恢复
    initFromStorage()

    return {
        token,
        isLogin,
        setToken,
        clearToken,
    }
})
