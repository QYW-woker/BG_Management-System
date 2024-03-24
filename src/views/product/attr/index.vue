<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <!-- 选择分类组件 -->
    <Category :scene="scene" />

    <!-- 展示属性 -->
    <el-card style="margin: 10px 0">
      <!-- 展示表格数据 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            algin="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150px"
            align="center"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170px" align="center">
            <template #="{ row }">
              <!-- 修改已有属性按钮 -->
              <el-button
                type="primary"
                size="default"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                @confirm="deleteAttr(row.id)"
                :title="`确定删除${row.attrName}？`"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="default"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示添加属性与修改数据的结构 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrParams.attrName"
              placeholder="请输入属性名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
          type="primary "
          size="default"
          icon="Plus"
        >
          添加属性
        </el-button>
        <el-button type="primary " size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          :data="attrParams.attrValueList"
          border
          style="margin: 10px 0"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row即为当前的属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                v-model="row.valueName"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ $index }">
              <el-button
                type="primary"
                size="default"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary "
          size="default"
          icon="Plus"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary " size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 获取三级分类仓库
import useCategoryStore from '@/stores/modules/category'
// 引入watch监听三级分类的ID
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
// 引入获取已有属性与属性值的接口
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from '@/api/product/attr/index'
// 引入获取已有属性与属性值的数据类型
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
// 注册使用三级分类仓库
const categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
// 定义card组件内容切换变量
let scene = ref<number>(0) // 0显示table，1展示添加与修改结构
// 收集添加属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})
// 准备一个数组，用来存储对应的属性值输入框el-input
let inputArr = ref<any>([])
// 路由组件销毁时的生命周期钩子
onBeforeUnmount(() => {
  // 将仓库分类相关的数据清空
  categoryStore.$reset()
})

// 监听三级分类的ID
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 必须三级分类的ID有了才发请求
    if (!categoryStore.c3Id) return
    // 调用方法
    getAttr()
  },
)

/**scene=0的操作**/
// 获取已有的属性和属性值方法封装成函数，在watch中调用
const getAttr = async () => {
  // 获取分类的ID
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    // 存储属性与属性值
    attrArr.value = result.data
  }
}
// 添加属性按钮的点击事件
const addAttr = () => {
  // 每一次点击时，清空属性值列表
  attrParams.attrName = ''
  Object.assign(attrParams, { attrValueList: [] })
  // 展示
  scene.value = 1
  // 点击按钮时收集三级分类的ID
  attrParams.categoryId = categoryStore.c3Id
}

// table表格修改按钮的点击事件
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给attrParams
  // Object.assign是浅拷贝，直接指向同一个内存地址
  // 实现深拷贝:JSON.parse(JSON.stringify(row))
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

/**scene=1的相关操作**/
// 添加属性中 取消 按钮的点击事件
const cancel = () => {
  scene.value = 0
}
// 添加属性按钮的点击事件
const addAttrValue = () => {
  // 点击添加属性值按钮时，向数组内添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每个属性值模式切换
  })
  // 获取最后的属性值的el-input，并让它聚焦
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}

// 保存按钮的点击事件
const save = async () => {
  // 1.收集参数
  // 2.发请求
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切换场景
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 重新获取所有数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
// 属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况的判断
  // 1.为空的属性值
  if (row.valueName.trim() == '') {
    // 删除属性值为空的元素值
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 2.相同的属性值，不能插入
  let repeat = attrParams.attrValueList.find((item) => {
    // 排除当前插入的属性值之后再去找数组内的有无相同
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值删除
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能相同',
    })
    return
  }
  // 将相应的属性值flag改变，展示div
  row.flag = false
}

// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  // 展示input
  row.flag = true
  // nextTick:响应式数据发生变化，获取更新的DOM
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除某个已有属性个的点击事件
const deleteAttr = async (attrId: number) => {
  // 发送请求删除
  let result = await reqDeleteAttr(attrId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style></style>
