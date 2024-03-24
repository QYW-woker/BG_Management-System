// 属性管理相关API接口
import request from '@/utils/request'
// 引入数据类型
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

enum API {
  // 获取一级分类
  CATEGORY1_URL = '/admin/product/getCategory1',
  // 获取二级分类
  CATEGORY2_URL = '/admin/product/getCategory2/',
  // 获取三级分类
  CATEGORY3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性和属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或者修改已有属性
  ADDORUPDATE_URL = '/admin/product/saveAttrInfo',
  // 删除已有属性
  DELETE_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类的接口方法
export const reqC1 = () =>
  request.get<any, CategoryResponseData>(API.CATEGORY1_URL)

// 获取二级分类接口方法
export const reqC2 = (category1Id: number | string) => {
  return request.get<any, CategoryResponseData>(API.CATEGORY2_URL + category1Id)
}

// 获取三级分类接口的方法
export const reqC3 = (category2Id: number | string) => {
  return request.get<any, CategoryResponseData>(API.CATEGORY3_URL + category2Id)
}

// 获取对应分类下已有的属性与属性值接口方法
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) => {
  return request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
}

// 新增属性或者修改已有属性的接口方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATE_URL, data)

// 删除某个已有属性的接口方法
export const reqDeleteAttr = (attrId: number | string) =>
  request.delete<any, any>(API.DELETE_URL + attrId)
