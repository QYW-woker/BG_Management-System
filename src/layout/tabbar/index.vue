<template>
  <div class="tabbar">
    <!-- 左侧 -->
    <div class="tabbar_left">
      <Breadcrumb />
    </div>

    <!-- 右侧 -->
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入左右侧内容
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>
<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // 线性渐变颜色
  // background-image: linear-gradient(
  //  to right,
  // rgb(249, 246, 246),
  //  rgb(170, 166, 166),
  //  rgb(200, 194, 194)
  // );
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
