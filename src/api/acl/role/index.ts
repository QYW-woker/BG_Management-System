// 角色管理相关请求接口

import request from '@/utils/request'
// 引入数据类型
import { RoleData, RoleResponseData, MenuResponseData } from './type'

// 枚举请求地址接口
enum API {
  // 获取所有职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 添加职位的接口
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新职位信息的接口
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部的角色权限菜单的接口
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 分配权限的接口
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/',
  // 删除权限的接口
  DELETE_URL = '/admin/acl/role/remove/',
}

// 获取全部职位的接口方法
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 添加与更新职位的接口方法
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    // 更新
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    // 添加
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 获取全部的角色权限菜单的接口方法
export const reqAllMuneList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + `${roleId}`)

// 给角色分配权限的接口方法
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`,
  )

// 删除已有的权限的接口方法
export const reqDeletePermission = (roleId: number) =>
  request.delete<any, any>(API.DELETE_URL + `${roleId}`)
