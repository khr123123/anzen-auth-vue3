<template>
    <a-row justify="center" style="height: 100vh; background: #f5f5f5;">
        <a-col :span="12">
            <a-card title="Login" bordered>
                <a-form :model="form" :rules="rules" ref="loginForm" labelAlign="left">
                    <a-form-item label="Username" field="username">
                        <a-input v-model="form.username" placeholder="Enter username" />
                    </a-form-item>

                    <a-form-item label="Password" field="password">
                        <a-input-password v-model="form.password" placeholder="Enter password" />
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" block @click="handleLogin">Login</a-button>
                    </a-form-item>
                </a-form>

                <p v-if="message" style="color: red; text-align: center;">{{ message }}</p>
            </a-card>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInstance, Message } from '@arco-design/web-vue'
import { userLogin } from '@/api/sysUserController'

const form = ref<API.UserLoginDto>({
    username: '',
    password: '',
})

const message = ref('')

const rules = {
    username: [{ required: true, message: 'Username is required' }],
    password: [{ required: true, message: 'Password is required' }],
}
const loginForm = ref<FormInstance>()
const handleLogin = () => {
    loginForm.value?.validate()
        .then(async () => {
            const res = await userLogin({ username: form.value.username, password: form.value.password })
            console.log(res);
            if (res.code == 0) {
                Message.success('登录成功!')
            } else {
                Message.error(res.message)
            }
        })
        .catch(() => {
            Message.warning('请填写完整信息')
        })
}
</script>

<style scoped></style>
