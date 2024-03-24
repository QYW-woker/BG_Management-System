// sku请求相关的数据类型

// 返回数据的公共数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// sku商品的数据类型
// sku中的平台属性数据类型
export interface skuAttr {
  id?: number
  attrId: number | string
  valueId: number | string
  valueName?: string
}

// sku中的销售属性数据类型
export interface skuSaleAttr {
  id?: number
  saleAttrId: number | string
  saleAttrValueId: string | number
  saleAttrValueName?: number
}

// sku中商品图片的数据类型
export interface skuImageList {
  id: number
  imgName: string
  imgUrl: string
  isDefault: string | number
  skuId: number
  spuImgId: number
}

// sku的数据类型
export interface SkuData {
  category3Id?: number | string
  spuId?: number | string
  tmId?: number | string
  skuName?: string
  price?: number | string
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: skuAttr[]
  skuSaleAttrValueList?: skuSaleAttr[]
  skuDefaultImg?: string
  isSale?: number
  id?: number
  skuImageList?: skuImageList[]
}

// sku请求接口返回的数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取sku商品详情服务器返回的数据类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
