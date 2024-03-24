// 菜单管理相关的请求数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 菜单数据域按钮的数据类型
export interface Permission {
  id?: number
  createTime: string
  updataTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  children?: PermissionList
  select: boolean
  level?: number
}

export type PermissionList = Permission[]

// 获取全部菜单服务器返回的数据类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

// 添加与修改菜单请求携带的参数数据类型
export interface MenuParams {
  id?: number
  code: string
  level: number
  name: string
  pid: number
}
