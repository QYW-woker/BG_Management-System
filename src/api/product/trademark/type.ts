// 定义品牌管理的数据类型

// 定义公用类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌商品数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含已有品牌全部数据类型
export type Records = TradeMark[]

// 全部品牌请求返回的数据类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
