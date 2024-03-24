<template>
  <div class="box">
    <div class="title">
      <p>数据统计</p>
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
  let option = {
    title: {
      text: '游客消费统计',
      left: 'center',
      textStyle: {
        color: 'white',
      },
    },
    // legend: {
    //   data: ['Allocated Budget', 'Actual Spending'],
    // },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '购物', max: 6500 },
        { name: '饮食', max: 16000 },
        { name: '交通', max: 30000 },
        { name: '心情', max: 38000 },
        { name: '景点', max: 52000 },
        { name: '消费', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
          },
        ],
      },
    ],
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
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
