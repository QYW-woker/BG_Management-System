<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>9999999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 展示图形图表 -->
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 引入水球图
import 'echarts-liquidfill'
let people = ref('289485人')
// 获取展示区DOM
let charts = ref()

// 获取echarts实例
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 绘制图表
  mycharts.setOption({
    // 标题
    title: {
      text: '实时游客统计',
    },
    // x轴组件
    xAxis: {},
    // y轴组件
    yAxis: {},
    // 系列列表：决定你展示什么样的图形图表
    series: {
      type: 'liquidFill',
      data: [0.7, 0.4, 0.2],
      waveAnimation: true,
      animationDuration: 2000,
      animationDurationUpdate: 0,
      radius: '100%',
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 15px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      background: url(../../../images/dataScreen-title.png) no-repeat;
      height: 7px;
      width: 68px;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 18px;
      margin-right: 10px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;
    span {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      background: url(../../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }
  .charts {
    width: 100%;
    height: 200px;
  }
}
</style>
