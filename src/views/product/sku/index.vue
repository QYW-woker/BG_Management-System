<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card>
    <!-- 展示区 -->
    <el-table :data="skuArr" border style="margin: 10px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        show-overflow-tooltip
        width="300px"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        show-overflow-tooltip
        width="300px"
      ></el-table-column>
      <el-table-column label="图片" width="200px">
        <template #="{ row }">
          <img
            :src="row.skuDefaultImg"
            style="height: 100px; width: 100px"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="200px"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="200px"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="300px">
        <template #="{ row }">
          <el-button
            @click="updateSale(row)"
            :type="row.isSale == 1 ? 'error' : 'primary'"
            seize="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
          ></el-button>
          <el-button
            type="primary"
            seize="small"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button
            @click="findSku(row)"
            type="primary"
            seize="small"
            icon="InfoFilled"
          ></el-button>
          <el-popconfirm
            @confirm="deleteSku(row.id)"
            width="200px"
            :title="`确定要删除${row.skuName}?`"
          >
            <template #reference>
              <el-button type="primary" seize="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
    <!-- 抽屉组件 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看详情</h4>
      </template>
      <!-- 抽屉内容区 -->
      <template #default>
        <!-- 栅格组件 -->
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 5px 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  style="height: 100%; width: 100%"
                  alt=""
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
      <!-- 抽屉底部 -->
      <template #footer></template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入sku的请求
import {
  reqSkuInfo,
  reqSkuList,
  reqSaleSku,
  reqCancelSku,
  reqDeleteSku,
} from '@/api/product/sku'
// 引入数据类型
import { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器数据
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 存储sku详情的信息
let skuInfo = ref<SkuData>({})

onMounted(() => {
  getSkuList()
})

// 将获取sku列表定义成函数
const getSkuList = async (page = 1) => {
  // 当前页码
  currentPage.value = page
  let result: SkuResponseData = await reqSkuList(
    currentPage.value,
    pageSize.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
// 分页器每页显示条数改变时的回调
const handleSizeChange = () => {
  getSkuList()
}

// sku商品上架与下架的点击事件
const updateSale = async (row: SkuData) => {
  // 判断当前sku是否上架
  if (row.isSale === 1) {
    // 当前sku商品下架
    await reqCancelSku(row.id as number)
    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    // 重新获取sku列表
    getSkuList(currentPage.value)
  } else {
    // 当前sku商品上架
    await reqSaleSku(row.id as number)
    ElMessage({ type: 'success', message: '上架成功' })
    getSkuList(currentPage.value)
  }
  // 发送请求
  reqSkuList(currentPage.value, pageSize.value)
}

// sku商品更新按钮
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '功能正在开发中...',
  })
}

// 查看商品详情的按钮
const findSku = async (row: SkuData) => {
  // 展示抽屉
  drawer.value = true
  // 发请求捞数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  // 存数据
  skuInfo.value = result.data
}

// 删除sku商品
const deleteSku = async (id: number) => {
  let result: any = await reqDeleteSku(id)

  console.log(result)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getSkuList(
      skuArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
