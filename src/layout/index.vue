<template>
  <div class="layout_container">
    <!-- 左侧导航 -->
    <div
      class="layout_slider"
      :class="{ folde: LayOutSettingStore.fold ? true : false }"
    >
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="$router.path"
          background-color="#001529"
          text-color="white"
          active-text-color="yellowgreen"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Tabbar />
    </div>
    <!-- 内容区 -->
    <div
      class="layout_main"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/stores/modules/user'
import useLayOutSettingStore from '@/stores/modules/setting'
// 内容展示区
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入顶部导航组件
import Tabbar from './tabbar/index.vue'

// 获取路由对象实例
let $router = useRoute()
// 获取layout配置仓库
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    &.folde {
      width: $base-menu-min-width;
    }
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
