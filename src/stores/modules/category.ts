// 商品三级分类全局组件的小仓库

import { defineStore } from 'pinia'
// 引入获取分类的请求
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
// 引入API中定义的数据类型
import type { CategoryResponseData } from '@/api/product/attr/type'
// 引入仓库state中定义的数据类型
import type { CategoryState } from './types/type'

const useCategotyStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 商品一级分类的数据
      c1Arr: [],
      // 商品一级分类ID
      c1Id: '',
      // 商品二级分类的数据
      c2Arr: [],
      // 商品二级分类的ID
      c2Id: '',
      // 商品三级分类的数据
      c3Arr: [],
      // 商品三级分类的ID
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类数据的请求
    async getC1() {
      // 发请求
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类数据的请求
    async getC2() {
      // 发请求
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    // 获取三级分类数据的请求
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
})

export default useCategotyStore
