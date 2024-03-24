// 小仓库：layout组件相关配置仓库
// 引入pinia
import { defineStore } from 'pinia'
// 创建仓库方法
const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      // 控制菜单折叠或打开
      fold: false,
      // 控制刷新效果
      refresh: false,
      // 刷新后丢失页面控制
      isNaN: false,
    }
  },
})
// 对外暴露
export default useLayOutSettingStore
