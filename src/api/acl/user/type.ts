// 用户管理相关的数据的ts数据类型

// 服务器返回数据公共部分的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 账号信息的数据类型
export interface User {
  id?: number | string
  createTime?: string
  updataTime?: string
  username: string
  password: string
  name: string
  phone?: string
  roleName?: string
}
// 账号信息存放的数组的数据类型
export type Records = User[]
// 获取用户账户信息服务器返回的数据类型
export interface UserResponse extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 角色的数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updataTime?: string
  roleName: string
  remark: null
}

// 所有角色的列表数据类型
export type AllRole = RoleData[]

// 获取全部角色身份的接口服务器返回的数据类型
export interface AllRoleResponse extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 分配角色接口携带参数的数据类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
