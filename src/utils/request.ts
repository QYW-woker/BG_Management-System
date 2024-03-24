// axios二次封装

import axios from 'axios'
import { ElMessage } from 'element-plus'
import { GET_TOKEN } from './token'
// 引入用户相关小仓库
// import useUserStore from '@/store/modules/user'
const request = axios.create({
  // 基础路径会携带 /api。
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // 返回配置对象
  // config配置对象有headers属性请求头，经常给服务器端携带公共参数
  const token = GET_TOKEN()
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    let message = ''
    const status = err.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器错误'
        break
      default:
        message = '网络错误'
    }
    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(new Error('faile'))
  },
)

// 对外暴露
export default request
