<template>
  <div class="logo" v-if="setting.logoShow">
    <img :src="setting.logo" alt="官网" />
    <p>{{ userStore.fold ? '' : setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
// 引入设置标题与logo的配置文件
import setting from '@/setting'
import useLayOutSettingStore from '@/stores/modules/setting'
let userStore = useLayOutSettingStore()
</script>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
    color: white;
  }
}
</style>
