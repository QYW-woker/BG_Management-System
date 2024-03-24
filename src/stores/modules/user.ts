// 用户相关的小仓库
import { defineStore } from 'pinia'
// 引入用户相关api
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入仓库state的数据类型
import type { UserState } from './types/type'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
// 引入登录相关请求类型约束
import type {
  loginFormData,
  loginResponseData,
  userInfoResponse,
} from '@/api/user/type'
import router from '@/router'
// 引入深拷贝方法
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
// 过滤路由的函数
function filterAsyncRoute(asyncRoutes: any, routes: any) {
  return asyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 数据存储
  state: (): UserState => {
    return {
      // 存储用户的token
      token: GET_TOKEN(),
      // 仓库存储生成菜单需要的路由数组
      menuRoutes: constantRoutes,
      // 用户信息
      username: '',
      avatar: '',
      // 存储用户是否有相应的按钮权限的数组
      buttons: [],
    }
  },

  // 异步、逻辑
  actions: {
    // 用户登录方法
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        // 将token存到pinia中，本地持久化存储
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户数据方法
    async userInfo() {
      // 发请求获取用户信息存储到仓库。携带token才能拿到用户信息
      const result: userInfoResponse = await reqUserInfo()

      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        // 调用函数判断用户信息中的routes与异步路由数组中是否有一致的
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoutes),
          result.data.routes,
        )

        // 整理菜单的数据
        this.menuRoutes = [...constantRoutes, ...userAsyncRoute, ...anyRoutes]
        // 目前路由器管理的只有常量路由：用户计算完毕的异步路由。任意路由动态追加
        ;[...userAsyncRoute, ...anyRoutes].forEach((route: any) => {
          router.addRoute(route)
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code == 200) {
        ;(this.token = ''), (this.username = ''), (this.avatar = '')
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },

  // 计算属性
  getters: {},
})

// 对外暴露
export default useUserStore
