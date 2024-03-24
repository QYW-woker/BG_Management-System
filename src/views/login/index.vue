<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到我的后台</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              show-password
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 引入路由插件
import { useRouter, useRoute } from 'vue-router'
// 引入用户小仓库
import useUserStore from '@/stores/modules/user'
// 引入element-plus
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
let userStore = useUserStore()
// 收集表单数据(使用代理对象reactive)
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// 获取路由器
let $router = useRouter()
// 控制按钮加载的效果
let loading = ref(false)
// 获取表单元素el-form组件
let loginForms = ref()
let $route = useRoute()
// 自定义校验规则函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // rule 校验的规则对象
  // value 表单元素文本内容
  // callback函数：如果符合条件callback放行通过即可
  // 如果不符合条件callback方法，注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassWord = (_rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

// 表单校验配置对象,validate对整个表单元素进行校验
const rules = {
  // 账号校验
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // {
    //   required: true,
    //   min: 5,
    //   max: 10,
    //   message: '账号长度为6-10位',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validatorUserName },
  ],
  // 密码校验
  password: [
    // {
    //   required: true,
    //   min: 6,
    //   max: 15,
    //   message: '长度为6-15位',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validatorPassWord },
  ],
}

// 登录按钮
const login = async () => {
  // 保证全部表单校验通过才发请求
  await loginForms.value.validate()

  loading.value = true
  // 使用仓库发登录请求。调用仓库中的方法
  try {
    // 登录成功
    await userStore.userLogin(loginForm)
    // 路由跳转。判断登录路径中是否有query参数
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 30px 60px;

    h1 {
      font-size: 40px;
      color: white;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
