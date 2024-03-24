// 用户管理相关的数据类型

// 服务器返回的数据公共类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 职位的数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

// 全部职位的数组的数据类型
export type Rocords = RoleData[]

// 获取职位服务器返回的数据类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Rocords
    total?: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取权限菜单与按钮每一级的data数据类型
export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  // 因为每一级子菜单数据类型都是一样的
  children?: MenuList
  select: boolean
}

// 权限菜单每一级的数据类型
export type MenuList = MenuData[]

// 获取菜单权限服务器返回的数据类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
