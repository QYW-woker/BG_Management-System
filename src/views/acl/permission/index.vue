<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-table
    :data="PermissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column
      width="100"
      align="center"
      label="权限值"
      prop="code"
    ></el-table-column>
    <el-table-column
      width="200"
      align="center"
      label="修改时间"
      prop="updateTime"
    ></el-table-column>
    <el-table-column align="center" label="操作">
      <template #="{ row }">
        <el-button
          :disabled="row.level == 4"
          type="primary"
          size="small"
          icon="Plus"
          @click="addPermisson(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          :disabled="row.level == 1"
          type="primary"
          size="small"
          icon="Edit"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          @confirm="deleteMenu(row.id)"
          :title="`确定删除&nbsp${row.name}&nbsp
          吗？`"
          width="280px"
        >
          <template #reference>
            <el-button
              :disabled="row.level == 1"
              type="primary"
              size="small"
              icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 添加或编辑菜单的dialog组件 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuParams.id ? '编辑菜单' : '添加菜单'"
  >
    <!-- 表单组件-收集数据 -->
    <el-form label-width="100px">
      <el-form-item label="名称">
        <el-input
          v-model="menuParams.name"
          placeholder="请输入菜单名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input
          v-model="menuParams.code"
          placeholder="请输入权限值"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

// 引入请求
import {
  reqGetAllPermission,
  reqAddOrUpdatePermission,
  reqDeletePermission,
} from '@/api/acl/permission/index'
// 引入数据类型
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '@/api/acl/permission/type'
import { ElMessage } from 'element-plus'

// 存储菜单的数据
let PermissionArr = ref<PermissionList>([])
// 控制dialog的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 添加菜单携带的参数
let menuParams = reactive<MenuParams>({
  id: 0,
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
onMounted(() => {
  getHasPermission()
})

// 获取菜单数据的请求封装
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqGetAllPermission()
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}

// 添加按钮的点击事件
const addPermisson = (row: Permission) => {
  // 清空数据
  Object.assign(menuParams, { id: 0, code: '', level: 0, name: '', pid: 0 })
  dialogVisible.value = true
  // 收集新增菜单的level和pid
  menuParams.level = (row.level as number) + 1
  menuParams.pid = row.id as number
}

// 编辑按钮的点击事件
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  // 收集已有信息并展示
  Object.assign(menuParams, row)
}

// dialog组件确定按钮的点击事件
const save = async () => {
  let result: any = await reqAddOrUpdatePermission(menuParams)
  if (result.code == 200) {
    dialogVisible.value = false
    getHasPermission()
    ElMessage({
      message: menuParams.id ? '更新成功' : '添加成功',
      type: 'success',
    })
  } else {
    ElMessage({
      message: menuParams.id ? '更新失败' : '添加失败',
      type: 'error',
    })
  }
}

// 删除按钮的点击事件
const deleteMenu = async (id: number) => {
  let result: any = await reqDeletePermission(id)
  if (result.code == 200) {
    getHasPermission()
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
  } else {
    ElMessage({
      message: '系统菜单不允许删除',
      type: 'error',
    })
  }
}
</script>

<style></style>
