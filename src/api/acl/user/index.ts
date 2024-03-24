// 用户管理相关请求的接口

import request from '@/utils/request'
// 引入数据类型
import type { SetRoleData, UserResponse, User, AllRoleResponse } from './type'

// 枚举接口地址
enum API {
  // 获取全部账号信息接口
  USERINFO_URL = '/admin/acl/user/',
  // 新增用户接口
  ADDUSER_URL = '/admin/acl/user/save',
  // 编辑用户信息接口
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 根据用户信息获取全部角色以及当前用户所拥有的角色接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 修改用户信息的角色身份的接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个用户信息的接口
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 删除选中的用户信息的接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove/',
}

// 获取用户账号信息接口的方法
export const reqGetUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponse>(
    API.USERINFO_URL + `${page}/${limit}/?username=${username}`,
  )

// 新增用户与编辑用户信息的接口的方法
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取所有的角色身份以及当前用户所拥有的角色的接口的方法
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponse>(API.ALLROLE_URL + userId)

// 分配角色的接口的方法
export const reqSetRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

// 删除某一个账号信息的接口方法
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

// 删除选中的账号信息的接口方法
export const reqRemoveAllUsers = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
