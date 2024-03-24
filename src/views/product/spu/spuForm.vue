<!-- eslint-disable vue/valid-attribute-name -->
<!-- 添加SPU和修改SPU -->
<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="SpuParams.spuName"
        placeholder="请输入SPU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in ALLTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <!-- 照片墙 -->
    <el-form-item label="SPU图片">
      <!-- v-model:fileList -> 展示默认图片
           action：上传的接口地址
           list-type:文件列表的类型
           on-preview：点击文件列表中已上传的文件时的钩子
           on-remove：移除文件列表中已
      -->
      <el-upload
        v-model:file-list="spuImgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : `没有未选择的属性`
        "
        v-model="saleAttrIdAndValueName"
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <!-- 添加属性值的按钮 -->
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        @click="addSaleAttrValue"
        style="margin-left: 10px"
        type="primary"
        icon="Plus"
        size="default"
      >
        添加属性值
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table :data="spuSaleAttrList" border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="销售属性名字"
          width="120px"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="item in row.spuSaleAttrValueList"
              :key="item.id"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
              class="mx-1"
              closable
              style="margin: 0 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-if="row.flag == true"
              v-model="row.saleAttrValue"
              placeholder="请输入属性值"
              style="width: 100px"
              size="small"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ $index }">
            <el-button
              @click="spuSaleAttrList.splice($index)"
              type="primary"
              size="samll"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存于取消 -->
    <el-form-item>
      <el-button @click="save" type="primary" size="default">保存</el-button>
      <el-button @click="cancel" type="primary" size="default">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 引入数据类型
import type {
  TrademarkResponseData,
  SpuImg,
  SpuSaleAttrResponseData,
  AllSpuSaleAttrResponseData,
  Trademark,
  SpuData,
  ImgListResponseData,
  HasSaleAttr,
  SpuSaleAttr,
  SpuSaleAttrValue,
} from '@/api/product/spu/type'
import {
  reqAllTrademark,
  reqSpuImgList,
  reqSpuSaleAttrList,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'
// 父子组件通信，$emit
let $emit = defineEmits(['changeScene'])

// 存储获取到的品牌名的数据
let ALLTradeMark = ref<Trademark[]>([])
// 存储照片墙数据
let spuImgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let spuSaleAttrList = ref<SpuSaleAttr[]>([])
// 整个项目的SPU的销售属性
let allSpuSaleAttrList = ref<HasSaleAttr[]>([])

// 存储用于修改SPU时用于展示的已有SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //三级分类ID
  description: '', // SPU描述
  spuName: '', // SPU名称
  tmId: '', // 品牌ID
  spuImgList: [],
  spuSaleAttrList: [],
})

// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 子组件点击取消按钮，通知父组件修改scene值
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 存储预览图片的地址
let dialogImageUrl = ref<string>()

// 收集未选择的销售属性的ID与属性值名字
let saleAttrIdAndValueName = ref<string>('')

// 定义方法, 接收父组件传来的spu数据并发请求获取展示的数据
const iniHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，用于修改时展示
  SpuParams.value = spu
  // spu：为父组件传递的spu数据对象
  // 发请求获取展示的数据
  // 获取所有品牌名数据
  let result: TrademarkResponseData = await reqAllTrademark()
  // 获取售卖属性的图片
  let result1: ImgListResponseData = await reqSpuImgList(spu.id as number)

  // 获取已有SPU销售属性
  let result2: SpuSaleAttrResponseData = await reqSpuSaleAttrList(
    spu.id as number,
  )
  // 获取整个项目全部的SPU销售属性
  let result3: AllSpuSaleAttrResponseData = await reqAllSaleAttr()
  // 存储品牌名
  ALLTradeMark.value = result.data
  // 存储照片墙数据。使用map将自己定义的ts类型修改为照片墙组件需要的ts类型
  spuImgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的SPU销售属性
  spuSaleAttrList.value = result2.data
  // 存储整个项目的SPU的销售属性
  allSpuSaleAttrList.value = result3.data
}

// 照片墙点击预览按钮时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  // filer:注入当前要预览的图片对象
  dialogImageUrl.value = file.url
  // 弹出对话框
  dialogVisible.value = true
}

// 照片墙点击删除按钮时候触发的钩子
const handleRemove = () => {}

// 照片墙上传成功之前的钩子
const handleUpload = (file: any) => {
  // 约束上传文件的条件
  if (file.type == 'image/jpeg' || file.type == 'image/png') {
    ElMessage({
      type: 'success',
      message: '上传成功',
    })
    return true
  } else {
    ElMessage({
      type: 'error',
      message: '上传的图片格式不正确',
    })
    return false
  }
}

// 计算当前SPU未拥有的属性
let unSelectSaleAttr = computed(() => {
  // 过滤掉当前已有的销售属性
  let unSelectArr = allSpuSaleAttrList.value.filter((item) => {
    return spuSaleAttrList.value.every((item1) => {
      return item.name !== item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加属性值按钮的点击事件
const addSaleAttrValue = () => {
  // 整理已获取的参数格式
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备新的销售属性对象：将来带给服务器
  let newSaleAttrValue: SpuSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组中
  spuSaleAttrList.value.push(newSaleAttrValue)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值按钮加号点击事件
const toEdit = (row: SpuSaleAttr) => {
  // 点击按钮显示输入框
  row.flag = true
  row.saleAttrValue = ''
}

// 属性值中input失去焦点时的回调
const toLook = (row: SpuSaleAttr) => {
  // 将收集的属性值插入到对应的spu中
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的格式
  let newSaleAttrValue: SpuSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 非法情况
  if (saleAttrValue?.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    row.flag = false
    return
  }
  // 是否有重复的属性值
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'warning',
      message: '属性值重复',
    })
    row.flag = false
    return
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的点击事件
const save = async () => {
  // 1.整理收集到的参数
  // 1.1 整理照片墙数据
  SpuParams.value.spuImgList = spuImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 1.2 整理销售属性数据
  SpuParams.value.spuSaleAttrList = spuSaleAttrList.value
  // 2.发请求添加|更新
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父亲组件切换场景0
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }

  // 3.重置收集的数据
}
/**添加SPU的操作**/
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '', //三级分类ID
    description: '', // SPU描述
    spuName: '', // SPU名称
    tmId: '', // 品牌ID
    spuImgList: [],
    spuSaleAttrList: [],
  })
  // 清空照片墙
  spuImgList.value = []
  // 清空销售属性列表
  spuSaleAttrList.value = []
  saleAttrIdAndValueName.value = ''
  // 存储三级分类ID
  SpuParams.value.category3Id = c3Id
  // 发请求获取所有品牌名和所有分类的数据
  // 获取所有品牌名数据
  let result: TrademarkResponseData = await reqAllTrademark()
  // 获取整个项目全部的SPU销售属性
  let result1: AllSpuSaleAttrResponseData = await reqAllSaleAttr()
  // 存储数据
  ALLTradeMark.value = result.data
  allSpuSaleAttrList.value = result1.data
}

// 将子组件内部方法对外暴露
defineExpose({ iniHasSpuData, initAddSpu })
</script>

<style></style>
