import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'get',
    params
  })
}
export function getWarehouses(params) {
  return request({
    url: '/main_store/warehouses',
    method: 'get',
    params
  })
}
// 获取客户
export function getClients(params) {
  return request({
    url: '/main_store/clients',
    method: 'get',
    params
  })
}
// 获取银行账户
export function getBankAccount(params) {
  return request({
    url: '/main_store/bankAccounts',
    method: 'get',
    params
  })
}
export function canUse(params) {
  return request({
    url: '/main_store/goods/canUse',
    method: 'get',
    params
  })
}

// 上传图片
export function upload(params) {
  return request({
    url: '/main_store/file/upload',
    method: 'get',
    params
  })
}
// 库存预警查询
export function StockEarlyWarning(params) {
  return request({
    url: '/main_store/storage/inventory/warehouse',
    method: 'get',
    params
  })
}
// 获取商品分类
export function getCommodityTypeData(params) {
  return request({
    url: '/main_store/goods/types',
    method: 'get',
    params
  })
}

// 查收支费用
export function getIncomeExpenses(params) {
  return request({
    url: '/main_store/incomeExpenses',
    method: 'get',
    params
  })
}
// 查收支费用
export function getGoodsCheck(params) {
  return request({
    url: '/main_store/goods/check',
    method: 'get',
    params
  })
}
// 查询客户上一次下单商品规格金额
export function getGoodSkuPrice(params) {
  return request({
    url: '/main_store/sell/client/goodsSku',
    method: 'get',
    params
  })
}
