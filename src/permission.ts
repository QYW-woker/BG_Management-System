// 路由鉴权。鉴权：项目中路由能不能被访问的权限设置
// 在入口文件main中注册一次，才会成功调用
import router from './router'
// 在入口文件main中注册一次，才会成功调用

// 引擎

// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 取消右上角的转圈
nprogress.configure({ showSpinner: false })
// 引入获取token
import { GET_TOKEN } from './utils/token'
// 引入仓库
import pinia from './stores'
import useUserStore from './stores/modules/user'
import setting from './setting'

// import useLayOutSettingStore from './stores/modules/setting'

const userStore = useUserStore(pinia)

// const settingStore = useLayOutSettingStore(pinia)
// 全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  const token = GET_TOKEN()
  const username = userStore.username

  // 已登录
  if (token) {
    // 不能去login
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 有username，放行
      if (username) {
        next()
      } else {
        // 没有username，在守卫发请求获取用户信息成功后放行
        try {
          await userStore.userInfo()
          // 当刷新时是异步路由，有可能已经获取到了用户信息，异步路由还没有加载完毕，所以会出现空白效果
          next({ ...to })
        } catch (error) {
          // token过期：获取不到用户信息
          // 用户修改本地的token
          // 退出登录 -> 清空用户数据
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach((_to: any, _from: any) => {
  nprogress.done()
})

/**
 * 未登录：只能去login
 * 已登录：不能去login
 */
