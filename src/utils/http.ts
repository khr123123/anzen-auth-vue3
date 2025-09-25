import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useTokenStore } from '@/store/tokenStore'
import { Message } from '@arco-design/web-vue'
import router from '@/router'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokenStore = useTokenStore()
        let token = tokenStore.token
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        if (res.code == 40101) {
            Message.warning(res.message)
            return Promise.reject(res)
        }
        return res
    },
    (error) => {
        if (error.response.data.code == 40100) {
            Message.warning(error.response.data.message)
            router.push('/login')
            return
        }
        return Promise.reject(error)
    }
)
export default request
