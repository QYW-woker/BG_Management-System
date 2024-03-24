<!-- eslint-disable vue/valid-attribute-name -->
<!-- 添加SKU的接口 -->
<template>
  <el-form label-width="120px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        v-model="skuParams.skuDesc"
        type="textarea"
        placeholder="SKU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model="skuParams.price"
        type="number"
        placeholder="价格(元)"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        v-model="skuParams.weight"
        type="number"
        placeholder="重量(克)"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleValue.id}`"
              v-for="saleValue in item.spuSaleAttrValueList"
              :key="saleValue.id"
              :label="saleValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table ref="table" border :data="imgArr">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          algin="center"
          label="名称"
          prop="imgName"
        ></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button @click="handle(row)" type="primary" size="small">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="save" type="primary" size="default">保存</el-button>
      <el-button @click="cancel" type="primary" size="default">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
let $emit = defineEmits(['changeScene'])
import { reactive, ref } from 'vue'
// 引入数据类型
import { SkuData } from '@/api/product/spu/type'
// 引入相关请求的接口方法
import { reqAttr } from '@/api/product/attr'
import { reqAddSku, reqSpuImgList, reqSpuSaleAttrList } from '@/api/product/spu'
import { ElMessage } from 'element-plus'
// 收集添加sku的请求参数
let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

// 存储平台属性
let attrArr = ref<any>([])
// 存储销售属性
let saleArr = ref<any>([])
// 存储照片墙
let imgArr = ref<any>([])
// 获取table组件VC
let table = ref<any>()

// 取消按钮的自定义点击事件
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 清空数据
  Object.assign(skuParams, {
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
  })
  // 收集添加sku的请求数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取销售属性
  let result1: any = await reqSpuSaleAttrList(spu.id)
  // 获取照片墙
  let result2: any = await reqSpuImgList(spu.id)
  // 存储响应的数据
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

// 设置默认图片按钮的点击事件
const handle = (row: any) => {
  // 排他法，点击时所有的都不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  // 复选框选中
  table.value.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮的点击事件
const save = async () => {
  // 整理参数
  // 整理平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 整理销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  // 发请求
  let result: any = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加sku成功',
    })
    // 通知父组件切换场景0
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加sku失败',
    })
  }
}
defineExpose({
  initSkuData,
})
</script>

<style></style>
