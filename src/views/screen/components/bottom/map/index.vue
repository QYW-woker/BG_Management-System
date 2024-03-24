<template>
  <div ref="map" class="box">地图</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

import china from './china.json'
let map = ref<any>()
// 注册中国地图
echarts.registerMap('china', china as any)

onMounted(() => {
  // 初始化echarts实例
  let mymap = echarts.init(map.value)
  // 设置配置项
  mymap.setOption({
    // 地图组件
    geo: {
      map: 'china', // 中国地图
      roam: true, // 鼠标缩放效果
      zoom: 1.5, // 地图缩放比例
      top: '28%',
      // 地图文字设置
      label: {
        show: true, // 显示文字
        color: '#fff', // 文字颜色
        fontSize: 10,
      },
      // 每一个区域的样式
      itemStyle: {
        color: 'skyblue',
        opacity: 0.8, //透明度
      },
      // 地图高亮的样式
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 30,
        },
      },
    },
    // 布局位置
    grid: {
      left: 0,
      right: 0,
      top: 100,
      bottom: '5%',
    },
    series: [
      {
        type: 'lines', //航线
        data: [
          {
            coords: [
              [113.280637, 23.125178], //起点
              [116.405285, 39.904989], //终点
            ],
            // 统一样式设置
            lineStyle: {
              color: 'yellowgreen',
              width: 3,
            },
          },
          {
            coords: [
              [113.280637, 23.125178],
              [108.320004, 22.82402],
            ],
            // 统一样式设置
            lineStyle: {
              color: 'yellowgreen',
              width: 3,
            },
          },
          {
            coords: [
              [113.280637, 23.125178],
              [87.617733, 43.792818],
            ],
            // 统一样式设置
            lineStyle: {
              color: 'yellowgreen',
              width: 3,
            },
          },
          {
            coords: [
              [113.280637, 23.125178],
              [121.509062, 25.044332],
            ],
            // 统一样式设置
            lineStyle: {
              color: 'yellowgreen',
              width: 3,
            },
          },
        ],
        // 线条特效
        effect: {
          show: true,
          // 特效的箭头
          symbol: 'arrow',
          color: 'red',
          symbolSize: 5,
        },
      },
    ],
  })
})
</script>

<style></style>
