<template>
  <div class="box">
    <div class="title">
      <p>年度游客量对比</p>
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
  mycharts.setOption({
    title: {
      text: '散点图',
      left: 'center',
      textStyle: {
        color: 'white',
      },
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      show: true,
    },
    grid: {
      left: 30,
      top: 30,
      right: 20,
      bottom: 30,
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 10,
        data: [40, 43, 56, 59, 42, 41, 39, 38, 55, 50, 40, 47, 51, 53, 60],
        label: {
          show: true,
          position: 'top',
          color: 'red',
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
  background: url(../../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    p {
      color: white;
      font-size: 16px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
