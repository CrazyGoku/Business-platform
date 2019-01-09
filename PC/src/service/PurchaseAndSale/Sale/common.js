import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}
export function getSellApply(params) {
  return request({
    url: '/pps/sell/apply',
    method: 'get',
    params
  })
}
export function getWarehouseData(params) {
  return request({
    url: '/pps/warehouses',
    method: 'get',
    params
  })
}
// 查询所有银行账户
export function getBankAccounts(params) {
  return request({
    url: '/pps/bankAccounts',
    method: 'get',
    params
  })
}
// 查找所有客户
export function getClients(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}
// 根据店铺编号和客户编号查询可用优惠券
export function getDiscountCouponCanUse(params) {
  return request({
    url: '/pps/marketing/discountCoupon/canUse',
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
// 查看订单详情
export function getSellApplyDetails(params, path) {
  return request({
    url: '/pps/sell/apply/detail/' + path,
    method: 'get',
    params
  })
}
// post请求
// 新增销售申请订单
export function postSellApply(data) {
  return request({
    url: '/pps/sell/apply',
    method: 'post',
    data
  })
}
// put请求
// 修改销售申请订单
export function putSellApply(data) {
  return request({
    url: '/pps/sell/apply',
    method: 'put',
    data
  })
}
// 红冲销售结果订单
export function postRedDashed(data) {
  return request({
    url: '/pps/sell/result/redDashed',
    method: 'put',
    data
  })
}
// delete请求
export function delSellApply(params) {
  return request({
    url: '/pps/sell/apply',
    method: 'delete',
    params
  })
}
