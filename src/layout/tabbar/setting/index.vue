<!-- 顶部导航-右侧-设置 -->
<template>
  <el-button
    size="default"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="default"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-popover placement="bottom" title="设置主题" :width="300" trigger="click">
    <el-form>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          inline-prompt
          size="default"
          v-model="dark"
          inactive-icon="Sunny"
          active-icon="MoonNight"
        />
      </el-form-item>
    </el-form>

    <template #reference>
      <el-button size="default" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 12px; border-radius: 50%"
    alt=""
  />
  <!-- 退出登录-下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 获取layout的小仓库
import useLayOutSettingStore from '@/stores/modules/setting'
// 获取用户相关的小仓库
import useUserStore from '@/stores/modules/user'
import { onMounted, ref } from 'vue'
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
// 收集开关的数据
let dark = ref<boolean>(false)
onMounted(() => {})
// 刷新按钮的回调
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 全屏按钮回调
const fullScreen = () => {
  // 使用DOM的fullscreenElement属性来进行判断是否全屏模式
  let fullscreen = document.fullscreenElement
  // 切换为全屏
  if (!fullscreen) {
    // 文档根节点的requestFullscreen方式，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}
// 退出登录按钮回调
const logout = async () => {
  // 1. 向服务器发退出登录请求
  // 2. 清空仓库中的用户相关信息以及本地存储的token
  // 3. 跳转到登录页面
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
// 暗黑模式切换
const changeDark = () => {
  // 获取HTML根节点
  let html = document.documentElement
  // 判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 主题颜色的设置
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style></style>
