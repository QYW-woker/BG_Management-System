<template>
  <div class="container">
    <!-- 内容区 -->
    <div ref="screen" class="screen">
      <!-- 顶部 -->
      <div class="top">
        <Top />
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 引入顶部的子组件
import Top from './components/top/index.vue'
// 引入底部左边相关子组件
import Tourist from './components/bottom/tourist/index.vue'
import Sex from './components/bottom/sex/index.vue'
import Age from './components/bottom/age/index.vue'

// 引入底部中间相关子组件
import Map from './components/bottom/map/index.vue'
import Line from './components/bottom/line/index.vue'

// 引入底部右边相关子组件
import Rank from './components/bottom/rank/index.vue'
import Year from './components/bottom/year/index.vue'
import Counter from './components/bottom/counter/index.vue'

// 获取数据大屏内容区盒子的DOM元素
let screen = ref()

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

// 定义缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww > wh ? wh : ww
}

// 监听窗口大小变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;

    // 设置缩放的基点 - 左上角
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .counter {
          flex: 1;
        }
      }
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
