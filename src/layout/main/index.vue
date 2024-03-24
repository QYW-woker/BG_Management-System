<template>
  <!-- 内容区路由组件出口
      使用slot进行组件的注入
      通过全局组件 component 动态的:is来渲染路由
  -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由的子路由 -->
      <!-- v-if为true则显示路由，false不显示 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// 获取layout小仓库
import useLayOutSettingStore from '@/stores/modules/setting'
import { nextTick, ref, watch } from 'vue'
// 配置小仓库
let LayOutSettingStore = useLayOutSettingStore()

// 标记，用于控制当前组件是否销毁重建
let flag = ref(true)
// 监听仓库内部的数据是否发生变化，当发生变化说明用户点击了刷新按钮
watch(
  () => LayOutSettingStore.refresh,
  () => {
    // 点击刷新按钮，路由组件销毁
    flag.value = false
    // 使用nextTick监听响应式数据更新完后DOM是否更新完成，当更新完说明已经销毁完毕。再次重新创建新的DOM
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'MainIndex',
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
