<template>
  <el-card>
    <div class="box">
      <!-- 用户信息 -->
      <img :src="userStore.avatar" alt="用户头像" class="avatar" />
      <div class="bottom">
        <h1 class="title">{{ getTime() }}好&nbsp;{{ userStore.username }}</h1>
        <p class="subTitle">小文后端运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="icon">
    <svg-icon height="400px" width="600px" name="welcome"></svg-icon>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关仓库
import useUserStore from '@/stores/modules/user'
// 引入事件工具
import { getTime } from '@/utils/time'

// 获取用户仓库对象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  margin-left: 40px;
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    align-items: center;
    .title {
      margin-top: 20px;
      font-size: 35px;
      margin-bottom: 30px;
      font-weight: 700;
    }
    .subTitle {
      font-style: italic;
      color: rgb(124, 124, 120);
    }
  }
}

.icon {
  display: flex;
  justify-content: center;
}
</style>
