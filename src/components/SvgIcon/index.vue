<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收父组件传递过来的参数——svg图标
defineProps({
  // xlink:href属性的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 提供使用的svg名字
  name: String,
  // 接收父组件传递的颜色
  color: {
    type: String,
    default: '',
  },
  // 接收父组件传递过来的宽度/高度
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style></style>
