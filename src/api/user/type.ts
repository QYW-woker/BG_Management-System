// 定义用户相关的数据的ts类型

// 用户登录携带参数的类型
export interface loginFormData {
  username: string
  password: string
}

// 全部接口返回数据都拥有的类型。可用于继承
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 定义获取用户信息返回数据类型
export interface userInfoResponse extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
