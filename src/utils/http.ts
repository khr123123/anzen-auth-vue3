import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useTokenStore } from '@/store/tokenStore'
import { Message } from '@arco-design/web-vue'
import router from '@/router'
import cache from '@/utils/cache'
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
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const sessionObj = cache.session.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.session.setJSON('sessionObj', requestObj)
        } else {
            const s_url = sessionObj.url                // 请求地址
            const s_data = sessionObj.data              // 请求数据
            const s_time = sessionObj.time              // 请求时间
            const interval = 1000                       // 间隔时间(ms)，小于此时间视为重复提交
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                const message = '数据正在处理，请勿重复提交'
                console.warn(`[${s_url}]: ` + message)
                return Promise.reject(new Error(message))
            } else {
                cache.session.setJSON('sessionObj', requestObj)
            }
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
        if (error.response?.data?.code == 40100) {
            Message.warning(error.response.data.message)
            router.push('/login')
            return
        }
        return Promise.reject(error)
    }
)
export default request
