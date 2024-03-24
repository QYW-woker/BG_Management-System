// SPU 相关的请求数据类型

// 服务器返回数据的公共类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | string
  spuSaleAttrList: null | SpuSaleAttr[]
  spuImgList: null | SpuImg[]
}

// records数组：元素是已有的SPU数据类型
export type Records = SpuData[]

// 定义获取已有的SPU接口服务器返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌名数据的数据类型
export interface Trademark {
  createTime: string
  id: number
  tmName: string
  logoUrl: string
  updateTime: string
}
// 品牌名服务器返回的数据的数据类型
export interface TrademarkResponseData extends ResponseData {
  data: Trademark[]
}

// 商品图片对象的数据类型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  imgName?: string
  imgUrl?: string
  spuId?: number
  name?: string
  url?: string
}

// 照片墙服务器返回的数据类型
export interface ImgListResponseData extends ResponseData {
  data: SpuImg[]
}

// 销售属性值对象的数据类型
export interface SpuSaleAttrValue {
  id?: number
  createTime?: null
  udateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储销售属性值的数组的数据类型
export type SpuSaleAttrValueList = SpuSaleAttrValue[]

// 销售属性对象的数据类型
export interface SpuSaleAttr {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  // 收集新增的属性值
  saleAttrValue?: string
}

// SPU销售属性的服务器返回数据类型
export interface SpuSaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

// 销售属性的的数据类型
export interface HasSaleAttr {
  id: number
  name: string
}

// 已有的全部销售属性的服务器返回数据类型
export interface AllSpuSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

// 添加sku中的平台属性数据类型
export interface skuAttr {
  attrId: number | string
  valueId: number | string
}

// 添加sku中的销售属性数据类型
export interface skuSaleAttr {
  saleAttrId: number | string
  saleAttrValueId: string | number
}

// 添加sku请求携带的数据类型
export interface SkuData {
  category3Id: number | string
  spuId: number | string
  tmId: number | string
  skuName: string
  price: number | string
  weight: string | number
  skuDesc: string
  skuAttrValueList?: skuAttr[]
  skuSaleAttrValueList?: skuSaleAttr[]
  skuDefaultImg: string
}

// 获取sku数据接口返回的数据类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
