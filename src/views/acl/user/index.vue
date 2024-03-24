<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <!-- 顶部卡片 -->
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input v-model="keyword" placeholder="请输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="keyword ? false : true"
          type="primary"
          size="default"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @click="reset" type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 展示区 -->
  <el-card style="margin: 10px 0">
    <el-button @click="addUser" type="primary" size="default">
      添加用户
    </el-button>
    <el-button
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
      type="primary"
      size="default"
    >
      批量删除
    </el-button>
    <!-- table展示用户信息 -->
    <el-table
      @selection-change="selectChange"
      :data="userArr"
      style="margin: 10px 0"
      border
    >
      <el-table-column
        type="selection"
        align="center"
        width="60px"
      ></el-table-column>
      <el-table-column
        align="center"
        label="序号"
        width="70px"
        type="index"
      ></el-table-column>
      <el-table-column
        prop="id"
        align="center"
        label="ID"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="用户名字"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="用户名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roleName"
        align="center"
        label="用户角色"
        show-overflow-tooltip
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
      <el-table-column align="center" label="操作" width="280px">
        <template #="{ row }">
          <el-button
            @click="setRole(row)"
            type="primary"
            size="small"
            icon="User"
          >
            分配角色
          </el-button>
          <el-button
            @click="updateUser(row)"
            type="primary"
            size="small"
            icon="Edit"
          >
            编辑
          </el-button>
          <el-popconfirm
            @confirm="deleteUser(row.id)"
            :title="`确定删除${row.username}吗？`"
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
      :page-sizes="[1, 3, 5, 7]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 添加与修改用户的抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '修改信息' : '添加用户' }}</h4>
    </template>
    <!-- 抽屉内容区 -->
    <template #default>
      <el-form
        ref="formRef"
        :model="userParams"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="username" label="用户姓名">
          <el-input
            v-model="userParams.username"
            placeholder="请输入用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="用户昵称">
          <el-input
            v-model="userParams.name"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" prop="password" label="用户密码">
          <el-input
            v-model="userParams.password"
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 抽屉底部 -->
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="save" type="primary">确定</el-button>
    </template>
  </el-drawer>
  <!-- 分配角色的抽屉组件 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配用户角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户名：">
          <el-input disabled="true" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 权限复选框 -->
          <el-checkbox-group
            @change="handleCheckedCitiesChange"
            v-model="userRole"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button @click="saveRole" type="primary">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入请求方法
import {
  reqSetRole,
  reqGetUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqRemoveAllUsers,
} from '@/api/acl/user'
// 引入数据类型
import {
  UserResponse,
  Records,
  User,
  AllRoleResponse,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 引入用户相关的仓库
import useLayOutSettingStore from '@/stores/modules/setting'
// 获取仓库对象
let settingStore = useLayOutSettingStore()
// 分页器相关
let currentPage = ref(1)
let pageSize = ref(3)
// 用户信息总个数
let total = ref<number>(0)
// 存储用户账户信息的数组
let userArr = ref<Records>([])
// 控制添加与修改用户抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取添加与修改用户抽屉的form组件的VC实例
let formRef = ref<any>()
// 控制分配角色抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储所有的角色身份
let allRole = ref<AllRole>([])
// 当前用户已有的角色身份信息
let userRole = ref<AllRole>([])
// 全选按钮的状态
let checkAll = ref<boolean>(false)
// 全选按钮不确定的样式
let isIndeterminate = ref<boolean>(true)
// 存放批量删除用户ID信息的数组
let selectIdArr = ref<User[]>([])
// 收集用户输入的搜索关键字
let keyword = ref<string>('')

onMounted(() => {
  getUserInfo()
})

// 将获取账号信息的请求封装
const getUserInfo = async (page = 1) => {
  currentPage.value = page
  let result: UserResponse = await reqGetUserInfo(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器页码改变的回调
const handleCurrentChange = () => {
  getUserInfo(currentPage.value)
}
// 分页器每页显示个数改变的回调
const handleSizeChange = () => {
  getUserInfo()
}

// 添加用户按钮的点击事件
const addUser = () => {
  drawer.value = true
  // 清空数据
  Object.assign(userParams, { id: '', username: '', name: '', password: '' })
  // 清理表单校验信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 编辑用户按钮的点击事件
const updateUser = (row: User) => {
  drawer.value = true
  // 存储回显的用户信息
  Object.assign(userParams, row)
  // 清除表单校验
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 抽屉保存按钮的点击事件
const save = async () => {
  // 判断form校验是否通过
  await formRef.value.validate()
  // 判断用户名是否为空，判断是添加还是编辑
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    // 提示信息
    ElMessage({
      message: userParams.id ? '修改成功' : '添加成功',
      type: 'success',
    })
    // 浏览器自动刷新
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      message: userParams.id ? '修改失败' : '添加失败',
      type: 'error',
    })
  }
}

// 抽屉取消按钮的点击事件
const cancel = () => {
  drawer.value = false
}

// 校验用户名
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // 长度至少五位
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度至少五位'))
  }
}
// 校验用户昵称
const validatorName = (_rule: any, value: any, callback: any) => {
  // 长度至少五位
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少五位'))
  }
}
// 校验用户密码
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  // 长度至少五位
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码长度至少五位'))
  }
}
// 抽屉表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassWord }],
}

// 分配角色按钮的点击事件
const setRole = async (row: User) => {
  // 存储已有用户信息
  Object.assign(userParams, row)
  // 发请求获取当前用户信息角色以及所有角色
  let result: AllRoleResponse = await reqAllRole(userParams.id as number)
  console.log(result)

  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}

// 全选按钮的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 底部复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 勾选上的个数与全部角色身份相等则全选
  checkAll.value = value.length === allRole.value.length
  // 修改不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
// 分配角色的确认按钮点击事件
const saveRole = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 发请求
  let result: any = await reqSetRole(data)
  if (result.code == 200) {
    ElMessage({
      message: '分配角色成功',
      type: 'success',
    })
    drawer1.value = false
    getUserInfo(currentPage.value)
  }
}
// 删除某一个用户信息
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getUserInfo(
      userArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  }
}

// 删除选中的用户信息
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 批量删除按钮的点击事件
const deleteSelectUser = async () => {
  // 整理参数
  let idList: any = selectIdArr.value.map((item) => item.id)
  console.log(idList)

  // 发请求
  let result: any = await reqRemoveAllUsers(idList)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getUserInfo(
      userArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  }
}

// 搜索按钮的点击事件
const search = () => {
  getUserInfo()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮的点击事件
const reset = () => {
  // 修改仓库中的refresh
  settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
