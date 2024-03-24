// 品牌管理模块接口
import request from '@/utils/request'
// 引入数据类型
import type { TradeMark, TradeMarkResponseData } from './type'

// 品牌管理模块接口地址，使用枚举
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 新增品牌接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update/',
  // 删除已有品牌接口
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌的接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 新增品牌或修改品牌的接口方法
export const reqAddorUpdateTrademark = (data: TradeMark) => {
  // 修改已有品牌
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post(API.ADDTRADEMARK_URL, data)
  }
}

// 删除已有品牌的接口方法
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETETRADEMARK_URL + id)
