// sku相关请求接口

import request from '@/utils/request'
// 引入约束的数据类型
import { SkuResponseData, SkuInfoData } from './type'

// 枚举地址
enum API {
  // 获取sku的接口
  SKU_URL = '/admin/product/list/',
  // sku商品上架的接口
  SALE_URL = '/admin/product/onSale/',
  // sku商品下架的接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 查看sku商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除sku商品的接口
  DELETESKU_URL = '/admin/product/deleteSku/',
}
// 获取SKU的接口方法
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// sku商品上架的接口方法
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

// sku商品下架的接口方法
export const reqCancelSku = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

// 获取sku商品详情的接口方法
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

// 删除sku商品的接口方法
export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
