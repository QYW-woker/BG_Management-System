<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <!-- 卡片card组件 -->
    <el-card class="box-card">
      <!-- 顶部-添加按钮 -->
      <el-button
        v-has="`btn.Trademark.add`"
        @click="addTrademark"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加品牌
      </el-button>
      <!-- 表格table组件:展示数据 -->
      <el-table :data="trademarkArr" border style="margin: 10px 0">
        <!-- column：列。展示数据使用的是div。也可以自定义使用slot -->
        <el-table-column type="index" label="序号" width="80px" align="center">
          <template #slot="{ $index }">
            <h1>{{ $index + 1 }}</h1>
          </template>
        </el-table-column>
        <el-table-column
          prop="tmName"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column label="LOGO" align="center">
          <template #="{ row }">
            <img
              :src="row.logoUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row }">
            <el-button
              v-has="`btn.Trademark.update`"
              @click="updateTrademark(row)"
              type="primary"
              size="default"
              icon="Edit"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
              @cancel="cancelIInfo"
            >
              <template #reference>
                <el-button icon="Delete" type="danger"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="getHasTrademark"
        @size-change="getHasTrademark"
        style="margin: 10px 0"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper, ->,sizes,total"
        :total="total"
      />
    </el-card>

    <!-- 对话框组件：添加和修改 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input
            v-model="trademarkParams.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <!-- action:资源上传地址请求的url。需要携带/api，代理服务器才能成功 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqHasTrademark,
  reqAddorUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
// 引入数据类型
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
// 上传图片前的函数参数类型
import { ElMessage, type UploadProps } from 'element-plus'
// 分页器数据
let pageNo = ref<number>(1)
let limit = ref<number>(3)
// 存储已有品牌数据总条数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集新增品牌的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
  id: undefined,
})
// 获取el-form组件实例
let formRef = ref()
// 将获取已有品牌的接口封装为一个函数，需要时调用即可
const getHasTrademark = async (page = 1) => {
  pageNo.value = page
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    // 数据总数
    total.value = result.data.total
    // 展示的数据
    trademarkArr.value = result.data.records
  }
}
// 组件挂载后执行的数据
onMounted(() => {
  getHasTrademark()
})
// 添加品牌的回调
const addTrademark = () => {
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // ts问号语法：表示当问号前为真才执行后面语句
  // 也可以使用nextTick来解决
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // 开启对话框
  dialogFormVisible.value = true
}
// 修改品牌回调
const updateTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true
  // 展示品牌数据
  Object.assign(trademarkParams, row)
  // 使用nextTick语法进行清除
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.id = row.id
}

// 对话框取消
const cancel = () => {
  dialogFormVisible.value = false
}

// 对话框确认按钮
const confirm = async () => {
  // 点击确认之前对整个表单进行一次校验
  // 校验通过后才会执行后面的语句
  await formRef.value.validate()
  let result: any = await reqAddorUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    // 关闭对话框
    cancel()
    ElMessage.success({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 重新获取数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error({
      type: 'error',
      message: trademarkParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 上传图片成功之前触发的函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传资源之前，可以对文件资源进行约束
  // 约束资源上传的格式
  const isJPG = rawFile.type == 'image/jpeg' || 'image/png' || 'image/gif'

  // 约束资源上传的大小
  const isLt8M = rawFile.size / 1024 / 1024 < 8
  if (isJPG) {
    if (isLt8M) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传头像图片大小不能超过 8MB!',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传头像图片只能是 JPG/PNG/GIF 格式!',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //  response 是上传成功后服务器返回的数据
  // uploadFile 是上传的文件
  trademarkParams.logoUrl = response.data
  // 图片上传成功，清除掉对应的校验规则
  formRef.value.clearValidate('logoUrl')
}
// 品牌名称自定义校验规则
const validatorTmName = (_rule: any, value: string, callback: any) => {
  if (value.trim().length >= 2 && value.trim().length <= 10) {
    callback()
  } else {
    callback(new Error('品牌名称在2-10个字符之间'))
  }
}
// 品牌LOGO自定义校验规则
const validatorLogoUrl = (_rule: any, value: string, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传品牌LOGO'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: {
    required: true,
    trigger: 'blur',
    validator: validatorTmName,
  },
  logoUrl: {
    required: true,
    trigger: 'blur',
    validator: validatorLogoUrl,
  },
}

// 删除气泡确认框的回调
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功!',
    })
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    // 提示删除失败
    ElMessage({
      type: 'error',
      message: '删除失败!',
    })
  }
}
// 删除气泡取消框的回调
const cancelIInfo = () => {
  ElMessage({
    type: 'info',
    message: '已取消删除',
  })
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
