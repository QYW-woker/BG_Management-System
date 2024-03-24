import { createApp } from 'vue'

import App from '@/App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置中文
import { zhCn } from 'element-plus/es/locales.mjs'
// 引入svg插件配置
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index'
// 引入全局样式
import '@/style/index.scss'
// 注册路由
import router from './router/index'

// 引入仓库
import pinia from './stores'
// 引入路由鉴权
import '@/permission'
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入自定义指令文件
import { isHasButton } from './directive/has'

// 获取应用实例对象
const app = createApp(App)
isHasButton(app)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
// 安装自定义插件
app.use(globalComponent)
// 注册路由
app.use(router)
// 注册仓库
app.use(pinia)
// 将应用挂载到挂载点
app.mount('#app')
