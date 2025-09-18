import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', //后端地址
    timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从 localStorage/sessionStorage/Pinia/Vuex 获取 token
        const token = localStorage.getItem('token')
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
        // if (res.code !== 200) {
        //     // 这里可以做错误处理，比如跳转登录
        //     console.error(res.message || '请求出错')
        //     return Promise.reject(res)
        // }
        return res
    },
    (error) => {
        console.error('网络错误:', error)
        return Promise.reject(error)
    }
)


export default request
