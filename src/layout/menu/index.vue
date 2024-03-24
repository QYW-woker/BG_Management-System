<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <!-- 动态的设置icon图标 -->
        <el-icon>
          <!-- component是全局组件，自带的一种属性 -->
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有两个以上的子路由 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 递归调用本身组件来生成二级菜单 -->
      <MenuIndex :menuList="item.children"></MenuIndex>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 引入路由器
import { useRouter } from 'vue-router'
// 获取路由器对象
let $router = useRouter()

// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])
// 点击菜单跳转对应的路由，通过VC来获取
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>
<!-- 因为要使用递归组件，所以需要有一个name。使用Vue2的写法起个名字，这样就可以使用递归组件了 -->
<script lang="ts">
export default {
  name: 'MenuIndex',
}
</script>

<style></style>
