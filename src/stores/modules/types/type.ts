// 定义小仓库数据state类型
import { RouteRecordRaw } from 'vue-router'
// 引入API中定义的数据类型
import type { CategoryObj } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 定义三级分类仓库的数据类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
  c2Id: string | number
  c2Arr: CategoryObj[]
  c3Id: string | number
  c3Arr: CategoryObj[]
}
