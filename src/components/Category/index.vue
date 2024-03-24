<template>
  <el-card>
    <el-form :inline="true">
      <!-- 一级分类 -->
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!-- value即为select收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 引入三级分类仓库
import useCategotyStore from '@/stores/modules/category'
// 使用三级分类仓库
const categoryStore = useCategotyStore()
// 接收父组件传递过来的值
defineProps(['scene'])

onMounted(() => {
  // 获取一级分类数据
  getC1()
})

// 通知仓库发请求封装函数
const getC1 = () => {
  // 调用仓库中的getC1方法发请求
  categoryStore.getC1()
}

// 一级分类下拉菜单的change事件（选中状态下触发，会有一级分类）
const handler = () => {
  // 当一级分类的数据放生变化时将二级、三级分类数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  // 调用仓库中的getC2方法发请求
  categoryStore.getC2()
}
// 二级分类下拉菜单的change事件（选中状态下触发，会有一级分类和二级分类）
const handler1 = () => {
  // 当二级分类的数据发生变化时将三级分类数据清空
  categoryStore.c3Id = ''
  // 调用仓库中的getC3方法发请求
  categoryStore.getC3()
}
</script>

<style></style>
