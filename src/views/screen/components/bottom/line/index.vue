<template>
  <div class="box">
    <div class="title">
      <p>未来7天游客数量趋势</p>
      <img src="../../../images/dataScreen-title.png" alt="" />
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置配置项
  mycharts.setOption({
    // 标题
    title: {
      // text: '访问量',
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      name: '日期',
      boundaryGap: false, //两侧不留白
      // 分割线
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '访问量',
      // 分割线
      splitLine: {
        show: false,
      },
      // 轴线
      axisLine: {
        show: true,
      },
      // 轴线刻度
      axisTick: {
        show: true,
      },
    },
    grid: {
      left: 40,
      top: 20,
      right: 15,
      bottom: 30,
    },
    // 系列
    series: [
      {
        type: 'line',
        data: [420, 340, 334, 956, 294, 988, 1100],
        smooth: true, // 曲线平滑
        areaStyle: {
          color: 'skyblue',
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-left: 10px;

  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
