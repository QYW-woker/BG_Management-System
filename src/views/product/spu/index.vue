<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>

    <!-- 展示区 -->
    <el-card style="margin: 10px 0">
      <!-- v-if | v-show都可以进行显隐，v-if会销毁 -->
      <!-- 场景0展示SPU -->
      <div v-show="scene == 0">
        <!-- 添加SPU按钮 -->
        <el-button
          :disabled="categoryStore.c3Id ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!-- 展示table -->
        <el-table :data="records" style="margin: 10px 0" border width="100%">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="description"
            show-overflow-tooltip
            label="SPU描述"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="300px">
            <template #="{ row }">
              <el-button
                @click="addSku(row)"
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                @click="updateSpu(row)"
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                @click="findSku(row)"
                type="primary"
                size="small"
                icon="View"
                title="查看SPU列表"
              ></el-button>
              <el-popconfirm
                :title="`确认删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout=" prev, pager, next, jumper ,->, total, sizes"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 场景1添加或修改SPU -->
      <spuForm
        ref="spuFormRef"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></spuForm>
      <!-- 场景2添加SKU -->
      <skuForm
        ref="skuFormRef"
        @changeScene="changeScene"
        v-show="scene == 2"
      ></skuForm>
      <!-- dialog对话框：展示已有的sku数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
                alt=""
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
// 引入SPU相关的数据类型
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
// 引入SPU中的请求
import { reqHasSpu, reqSkuList, reqDeleteSpu } from '@/api/product/spu'
// 引入三级分类仓库
import useCategotyStore from '@/stores/modules/category'
// 引入SpuForm子组件
import spuForm from './spuForm.vue'
// 引入skuForm子组件
import skuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'
// 获取SpuForm子组件VC实例,在父组件点击事件中利用获取到的子组件VC实例来发请求
let spuFormRef = ref<any>()
// 获取skuForm子组件VC实例,在父组件点击事件中利用获取到的子组件VC实例来发请求
let skuFormRef = ref<any>()
// 使用三级分类仓库
const categoryStore = useCategotyStore()
// 场景数值:0显示SPU 1添加或修改SPU 2添加SKU
let scene = ref<number>(0)
// 分页当前页码
let currentPage = ref<number>(1)
// 分页每页显示条数
let pageSize = ref<number>(3)

// 存储从服务器获取的SPU数据
let records = ref<Records>([])
// 存储SPU数据总条数
let total = ref<number>(0)
// 存储sku列表的数据
let skuArr = ref<SkuData[]>([])
// 控制sku数据展示列表的dialog组件的显示与隐藏
let show = ref<boolean>(false)

/**场景0相关**/
// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 必须有三级分类才发请求
    if (!categoryStore.c3Id) return

    getHasSpu()
  },
)

// 将获取SPU数据请求封装成函数
const getHasSpu = async (page = 1) => {
  // 修改每页条数
  currentPage.value = page
  let result: HasSpuResponseData = await reqHasSpu(
    currentPage.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  // 存数据
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器的下拉菜单发生变化时触发
const changeSize = () => {
  getHasSpu()
}

// 路由组件销毁前，将仓库数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})

/**场景1相关**/
// 添加SPU按钮点击事件
const addSpu = () => {
  // 修改场景值
  scene.value = 1
  // 调用子组件中的方法
  spuFormRef.value.initAddSpu(categoryStore.c3Id)
}

// 父子组件通信，与子组件spuForm通信。点击SPUForm中的取消后通知父组件修改scene值
const changeScene = (obj: any) => {
  // 子组件传递过来的数据
  scene.value = obj.flag
  // 再次请求数据
  if (obj.params == 'update') {
    // 更新留在当前页
    getHasSpu(currentPage.value)
  } else {
    // 添加在第一页
    getHasSpu()
  }
}

// 修改SPU按钮点击事件
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 通过使用获取到的子组件VC实例，调用子组件中对外暴露的方法
  spuFormRef.value.iniHasSpuData(row)
}

// 删除已有SPU按钮点击事件
const deleteSpu = async (row: SpuData) => {
  let result = await reqDeleteSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取数据
    getHasSpu(
      records.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
/**场景2相关**/
// 添加SKU按钮点击事件
const addSku = (row: SpuData) => {
  scene.value = 2
  // 调用子组件中的方法
  // 将三级分类ID和对应的spuID传递给子组件
  skuFormRef.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看sku列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    // 显示对话框
    show.value = true
  }
}
</script>

<style></style>
