<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input v-model="keyword" placeholder="请输入关键字搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="search"
          :disabled="keyword ? false : true"
          type="primary"
        >
          搜索
        </el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 展示区 -->
  <el-card style="margin: 10px 0">
    <el-button @click="addRole" type="primary" icon="Plus">添加职位</el-button>
    <el-table :data="allRole" border style="margin: 10px 0">
      <el-table-column
        type="index"
        align="center"
        label="#"
        width="60px"
      ></el-table-column>
      <el-table-column
        prop="id"
        align="center"
        label="ID"
        width="100px"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        show-overflow-tooltip
        align="center"
        label="职位名称"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template #="{ row }">
          <el-button
            @click="setPermission(row)"
            type="primary"
            size="small"
            icon="User"
          >
            分配权限
          </el-button>
          <el-button
            @click="updateRole(row)"
            type="primary"
            size="small"
            icon="Edit"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定要删除&nbsp${row.roleName}吗？`"
            width="300px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
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
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getHasRole"
    />
  </el-card>

  <!-- 添加职位与更新职位的dialog组件 -->
  <el-dialog v-model="diaView" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form ref="form" :model="RoleParams" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          v-model="RoleParams.roleName"
          placeholder="请输入职位名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="diaView = false" type="primary">取消</el-button>
      <el-button @click="save" type="primary">确定</el-button>
    </template>
  </el-dialog>

  <!-- 分配权限的drawer组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形组件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedIds"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入请求函数
import {
  reqAllMuneList,
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqSetPermission,
  reqDeletePermission,
} from '@/api/acl/role'
// 引入数据类型
import {
  MenuResponseData,
  RoleResponseData,
  Rocords,
  RoleData,
  MenuList,
} from '@/api/acl/role/type'
// 引入setting仓库
import useLayOutSettingStore from '@/stores/modules/setting'
import { ElMessage } from 'element-plus'

// 分页器相关
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
// 搜索关键字
let keyword = ref<string>('')
// 存储全部的职位信息
let allRole = ref<Rocords>([])
// 职位总个数
let total = ref<number>(0)
// 使用setting仓库
let settingStore = useLayOutSettingStore()
// 控制添加职位对话框的显示与隐藏
let diaView = ref<boolean>(false)
// 收集添加职位的数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})
// 获取form的VC实例
let form = ref<any>()
// 控制权限分配drawer的显示与隐藏
let drawer = ref<boolean>(false)
// 收集分配权限的数据
let menuArr = ref<MenuList>([])
// 收集勾选的菜单权限的四级节点id
let checkedIds = ref<number[]>([])
// 获取tree组件的VC实例
let tree = ref<any>()

onMounted(() => {
  getHasRole()
})

// 将获取职位的请求封装成函数
const getHasRole = async (page = 1) => {
  currentPage.value = page
  let result: RoleResponseData = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    allRole.value = result.data.records
    total.value = result.data.total as number
  }
}

// 每页显示多少条
const handleSizeChange = () => {
  getHasRole()
}

// 搜索按钮的点击事件
const search = () => {
  getHasRole()
  keyword.value = ''
}

// 重置按钮的点击事件
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

// 添加职位的点击事件
const addRole = () => {
  diaView.value = true
  Object.assign(RoleParams, { roleName: '', id: '' })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 更新已有职位的点击事件
const updateRole = (row: RoleData) => {
  diaView.value = true
  // 存储已有的职位
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

// 用户名校验规则
const validatorRoleName = (_rule: any, value: string, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('至少两个字符'))
  }
}

// 添加职位输入框的校验
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}

// 弹出框确定按钮的点击事件
const save = async () => {
  // 表单校验结果必须通过才能发请求
  await form.value.validate()
  // 发请求
  let result: RoleResponseData = await reqAddOrUpdateRole(RoleParams)
  if (result.code === 200) {
    ElMessage({
      message: RoleParams.id ? '更新成功' : '添加成功',
      type: 'success',
    })
    diaView.value = false
    getHasRole(RoleParams.id ? currentPage.value : 1)
  } else {
    ElMessage({
      message: RoleParams.id ? '更新失败' : '添加失败',
      type: 'error',
    })
  }
}

// 分配权限点击事件
const setPermission = async (row: RoleData) => {
  // 显示分配权限弹出框
  drawer.value = true
  // 收集当前需要分配权限的角色数据
  Object.assign(RoleParams, row)
  // 发请求获取权限
  let result: MenuResponseData = await reqAllMuneList(RoleParams.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    checkedIds.value = filterSelectArr(menuArr.value, [])
  }
}

// 树形组件tree的数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 筛选权限菜单四级节点的id的方法
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    // 递归调用查询子节点
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// 分配权限抽屉确定按钮的点击事件
const confirmClick = async () => {
  // 职位的ID
  const roleId = RoleParams.id
  // 选中权限节点的ID
  let checkedIdArr = tree.value.getCheckedKeys()
  // 半选中的节点的ID
  let idArr = tree.value.getHalfCheckedKeys()
  let permissionId = checkedIdArr.concat(idArr)
  // 发请求
  let result: any = await reqSetPermission(roleId as number, permissionId)
  if (result.code === 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示成功信息
    ElMessage.success('分配权限成功')
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage.error('分配权限失败')
  }
}

// 删除已有的权限
const removeRole = async (id: number) => {
  let result = await reqDeletePermission(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasRole(
      allRole.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
