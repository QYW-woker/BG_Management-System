// 自定义指令

import pinia from '@/stores'
import useUserStore from '@/stores/modules/user'

const userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
  // 获取用户仓库
  // 全局自定义指令：实现按钮的权限
  app.directive('has', {
    // 当使用全局自定义指令会执行以下的代码
    mounted(el: any, options: any) {
      // 自定义指令右侧的数值：如果用户信息buttons数组当中没有
      // 从DOM树上移除
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
