// 管理项目用户相关的接口
import request from '@/utils/request'
import type { loginFormData, loginResponseData, userInfoResponse } from './type'
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: loginFormData) =>
  // post<请求的类型，约束返回数据的类型>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponse>(API.USERINFO_URL)

// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
