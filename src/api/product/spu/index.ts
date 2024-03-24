// SPU 管理模块接口
import request from '@/utils/request'
// 引入数据类型
import {
  HasSpuResponseData,
  TrademarkResponseData,
  ImgListResponseData,
  SpuSaleAttrResponseData,
  AllSpuSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

enum API {
  // 获取已有SPU的接口
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌名的接口
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下的售卖商品的全部图片的接口
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个SPU下的销售属性的接口
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加SPU接口
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 修改SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 添加sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看sku
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除spu
  DELETE_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) => {
  return request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
}

// 获取全部的SPU品牌的数据
export const reqAllTrademark = () =>
  request.get<any, TrademarkResponseData>(API.ALLTRADEMARK_URL)

// 获取某个SPU下的售卖商品的全部图片的数据
export const reqSpuImgList = (spuId: number) =>
  request.get<any, ImgListResponseData>(API.IMAGE_URL + spuId)

// 获取某个SPU下的销售属性的数据
export const reqSpuSaleAttrList = (spuId: number) =>
  request.get<any, SpuSaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, AllSpuSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加SPU或修改SPU。data为ID或当前SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 有ID为更新
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    // 无ID为修改
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加SKU的接口方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取sku的接口方法
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

// 删除spu的接口方法
export const reqDeleteSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETE_URL + spuId)
