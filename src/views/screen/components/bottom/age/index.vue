<template>
  <div class="box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表 -->

    <div ref="charts" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref<any>()

onMounted(() => {
  let mycharts = echarts.init(charts.value)

  // 设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 30,
      top: 70,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold',
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '幼儿' },
          { value: 735, name: '小孩' },
          { value: 580, name: '青年' },
          { value: 484, name: '中年' },
          { value: 300, name: '老年' },
        ],
      },
    ],
    gride: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  //绘制图表
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    margin-top: 20px;
    height: 260px;
  }
}
</style>
