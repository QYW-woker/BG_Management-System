// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
// 引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Category from './Category/index.vue'
// 全局组件放在一个对象属性身上
const allGloableComponent: any = { SvgIcon, Category }

// 对外暴露插件对象
export default {
  // 插件对象内只能叫 install
  install(app: any) {
    // 将所有的全局组件进行注册
    Object.keys(allGloableComponent).forEach((key) => {
      // 遍历后每个组件都注册
      app.component(key, allGloableComponent[key])
    })
    // 将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
