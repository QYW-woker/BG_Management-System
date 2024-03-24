<template>
  <div class="box">
    <div class="title">
      <p>景区排行</p>
      <img src="../../../images/dataScreen-title.png" alt="" />
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

let charts = ref()

onMounted(() => {
  // 一个容器可以同时展示多个图形图表
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '景区排行',
      left: 'center',
      link: '', // 超链接
      textStyle: {
        color: 'white',
      },
      // 子标题
      subtext: '各大景区排行',
      // 子标题样式
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 15,
      },
    },
    xAxis: {
      type: 'category', // 在x周均匀分布展示
    },
    yAxis: {},
    grid: {
      left: 40,
      bottom: 30,
      right: 20,
      top: 80,
    },
    // 系列：决定显示图形图表。[]：可放多个图形；{}：放一个图形
    series: [
      // 柱状图
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        // 柱状图的文本标签
        label: {
          show: true,
          // 文字位置
          position: 'insideTop',
          color: 'red',
          textSize: 20,
        },
        // 是否显示背景颜色
        showBackground: false,
        backgroundStyle: {
          color: 'skyblue',
        },
        // 柱状图的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: 'orange',
        },
      },
      // 折线图
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 100],
        smooth: true,
      },
    ],
    // 提示框
    tooltip: {},
  })
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
