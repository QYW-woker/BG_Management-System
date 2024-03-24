<!-- 顶部导航-左侧-面包屑 -->
<template>
  <!-- 左侧-icon -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <!-- 可以动态的加载响应的组件， :is属性可以写字符串 -->
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧-面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示路由名字与标题。使用路由对象中matched属性 -->
    <el-breadcrumb-item
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// 导入setting小仓库
import useLayOutSettingStore from '@/stores/modules/setting'
import { useRoute } from 'vue-router'
// 获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore()
let $router = useRoute()
// 点击图标的事件
const changeIcon = () => {
  // 图标切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<script lang="ts">
export default {
  name: 'BreadCrumb',
}
</script>

<style></style>
