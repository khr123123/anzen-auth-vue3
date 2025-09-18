import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 定义响应数据格式
export interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', //后端地址
    timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
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
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const res = response.data
        if (res.code !== 200) {
            // 这里可以做错误处理，比如跳转登录
            console.error(res.message || '请求出错')
            return Promise.reject(res)
        }
        return res.data
    },
    (error) => {
        console.error('网络错误:', error)
        return Promise.reject(error)
    }
)

// 封装常用请求方法
export const get = <T = any>(url: string, params?: object) => {
    return service.get<T>(url, { params })
}

export const post = <T = any>(url: string, data?: object) => {
    return service.post<T>(url, data)
}

export const put = <T = any>(url: string, data?: object) => {
    return service.put<T>(url, data)
}

export const del = <T = any>(url: string, params?: object) => {
    return service.delete<T>(url, { params })
}

export default service
