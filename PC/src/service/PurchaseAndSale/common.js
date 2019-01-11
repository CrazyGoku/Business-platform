import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}
export function getWarehouses(params) {
  return request({
    url: '/pps/warehouses',
    method: 'get',
    params
  })
}
// 获取客户
export function getClients(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}
// 获取银行账户
export function getBankAccount(params) {
  return request({
    url: '/pps/bankAccounts',
    method: 'get',
    params
  })
}
export function canUse(params) {
  return request({
    url: '/pps/goods/canUse',
    method: 'get',
    params
  })
}

// 上传图片
export function upload(params) {
  return request({
    url: '/pps/file/upload',
    method: 'get',
    params
  })
}
// 库存预警查询
export function StockEarlyWarning(params) {
  return request({
    url: '/pps/storage/inventory/warehouse',
    method: 'get',
    params
  })
}
// 获取商品分类
export function getCommodityTypeData(params) {
  return request({
    url: '/pps/goods/types',
    method: 'get',
    params
  })
}
