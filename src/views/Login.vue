<template>
    <div class="container">
        <!-- 左上角 header -->
        <header class="header" role="banner">
            <img src="@/assets/logo.png" alt="ANZEN logo" class="logo" />
            <div class="header-text">ANZEN</div>
        </header>
        <!-- 中心登录区 -->
        <main class="content" role="main">
            <a-card class="login-card" :bordered="false">
                <div class="card-head">
                    <h2 class="title">欢迎登录</h2>
                    <p class="subtitle">请输入你的账号密码以继续</p>
                </div>
                <a-form ref="formRef" :model="form" :rules="rules" hide-asterisk layout="vertical"
                    @submit="handleSubmit">
                    <!-- 用户名 -->
                    <a-form-item field="username" hide-asterisk>
                        <a-input v-model="form.username" placeholder="用户名／邮箱" aria-label="用户名" autofocus>
                            <template #prefix>
                                <IconUser />
                            </template>
                        </a-input>
                    </a-form-item>
                    <!-- 密码 -->
                    <a-form-item field="password" hide-asterisk>
                        <a-input-password v-model="form.password" placeholder="密码" aria-label="密码">
                            <template #prefix>
                                <IconLock />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <!-- 记住我 / 忘记密码 行 -->
                    <div class="row between">
                        <a-checkbox v-model:checked="form.remember">记住我</a-checkbox>
                        <a-link class="forgot" @click.prevent="onForgot">忘记密码？</a-link>
                    </div>
                    <!-- 提交 -->
                    <a-form-item>
                        <a-button :loading="loading" type="primary" html-type="submit" long>
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
                <!-- 小提示 -->
                <div class="help">首次使用请联系管理员创建账号</div>
            </a-card>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue'
import { getLoginUserInfo, getRouters, userLogin } from '@/api/sysUserController'
import { useUserStore } from '@/store/userStore'
import { useMenuStore } from '@/store/menuStore'
import { useTokenStore } from '@/store/tokenStore'


const userStore = useUserStore()
const menuStore = useMenuStore()
const tokenStore = useTokenStore()


const formRef = ref<FormInstance | null>(null)
const loading = ref(false)

const form = reactive<API.UserLoginDto & { remember?: boolean }>({
    username: '',
    password: '',
})

const rules = {
    username: [
        { required: true, message: '请输入用户名' },
        {
            validator: (value: string, callback: any) => {
                if (!value) return callback()
                if (value.length < 4 || value.length > 6) {
                    return callback('用户名长度需在 4~6 个字符之间')
                }
                return callback()
            }
        }
    ],
    password: [
        { required: true, message: '请输入密码' },
        {
            validator: (value: string, callback: any) => {
                if (!value) return callback()
                if (value.length < 6 || value.length > 12) {
                    return callback('密码长度需在 6~12 个字符之间')
                }
                return callback()
            }
        }
    ]
}



const handleSubmit = async () => {
    try {
        // 校验表单
        await formRef.value?.validate()
    } catch (err) {
        return
    }

    loading.value = true
    try {
        const result = await userLogin(form)
        if (result.code === 0) {
            Message.success('登录成功')
            tokenStore.setToken(result.data) // 保存 token
            // 2. 获取用户信息
            const userRes = await getLoginUserInfo()
            if (userRes.code === 0) {
                userStore.setUser(userRes.data) // 存到 Pinia
            }
            // 3. 获取菜单信息
            const menuRes = await getRouters()
            if (menuRes.code === 0) {
                menuStore.setMenus(menuRes.data) // 构建树并存储
            }

            setTimeout(() => {
                window.location.href = '/'
            }, 1000)
        } else {
            Message.error(result.message)
        }
    } catch (e: any) {
        Message.error(e?.message || '登录失败，请重试')
    } finally {
        loading.value = false
    }
}

const onForgot = () => {
    Message.info({ id: 'forgot', content: '请联系管理员重置密码' })
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    display: flex;
    background-image: url('../assets/background.webp');
    background-repeat: no-repeat;
    background-size: cover;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* header */
.header {
    position: fixed;
    top: 20px;
    left: 24px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.01);
}

.logo {
    width: 44px;
    height: 44px;
    object-fit: contain;
}

.header-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-1, #165fdd);
    letter-spacing: 1px;
}

/* 主体区域 */
.content {
    width: 100%;
    max-width: 400px;
    padding: 24px;
}

.login-card {
    border-radius: 14px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 12px 40px rgba(16, 24, 40, 0.12);
}

.card-head {
    text-align: center;
    margin-bottom: 12px;
}

.title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
}

.subtitle {
    margin: 6px 0 0;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
}

.row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 12px;
}

.row.between {
    justify-content: space-between;
}

.forgot {
    cursor: pointer;
    font-size: 13px;
}

.help {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
}

/* 深色主题适配 */
body[arco-theme='dark'] .header {
    background: rgba(10, 10, 12, 0.6);
}

body[arco-theme='dark'] .login-card {
    background: rgba(10, 10, 12, 0.7);
    color: rgba(255, 255, 255, 0.92);
    box-shadow: none;
}

/* 响应式 */
@media (max-width: 480px) {
    .header {
        left: 12px;
        top: 12px;
        padding: 6px;
    }

    .content {
        padding: 12px;
    }

    .logo {
        width: 36px;
        height: 36px;
    }

    .header-text {
        font-size: 16px;
    }

    .login-card {
        padding: 16px;
    }
}
</style>