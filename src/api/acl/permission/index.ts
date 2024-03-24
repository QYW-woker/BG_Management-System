// 菜单管理相关的请求接口

import request from '@/utils/request'

import type { PermissionResponseData, MenuParams } from './type'

// 枚举地址
enum API {
  // 获取全部菜单与按钮的接口
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 新增菜单的接口
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  // 编辑菜单的接口
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  // 删除菜单的接口
  DELETPERMISSION_URL = '/admin/acl/permission/remove/',
}

// 获取全部菜单数据的接口方法
export const reqGetAllPermission = () => {
  return request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
}

// 新增菜单或编辑菜单的接口方法
export const reqAddOrUpdatePermission = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}

// 删除菜单接口的方法
export const reqDeletePermission = (id: number) => {
  return request.delete<any, any>(API.DELETPERMISSION_URL + id)
}
