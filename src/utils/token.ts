// 封装本地存储数据域读取数据方法

// 存token
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
// 取token
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
// 清空token
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
