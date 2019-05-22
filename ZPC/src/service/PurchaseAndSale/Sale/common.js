import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'get',
    params
  })
}
export function getClientDetail(params) {
  return request({
    url: '/main_store/clients',
    method: 'get',
    params
  })
}
export function getSellApply(params) {
  return request({
    url: '/main_store/sell/apply',
    method: 'get',
    params
  })
}
export function getSellResult(params) {
  return request({
    url: '/main_store/sell/result',
    method: 'get',
    params
  })
}
export function getWarehouseData(params) {
  return request({
    url: '/main_store/warehouses',
    method: 'get',
    params
  })
}
// 查询所有银行账户
export function getBankAccounts(params) {
  return request({
    url: '/main_store/bankAccounts',
    method: 'get',
    params
  })
}
// 查找所有客户
export function getClients(params) {
  return request({
    url: '/main_store/clients',
    method: 'get',
    params
  })
}
// 根据店铺编号和客户编号查询可用优惠券
export function getDiscountCouponCanUse(params) {
  return request({
    url: '/main_store/marketing/discountCoupon/canUse',
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
// 查看订单详情
export function getSellApplyDetails(params, path) {
  return request({
    url: '/main_store/sell/apply/detail/' + path,
    method: 'get',
    params
  })
}
// 查看订单详情
export function getSellResultDetails(params, path) {
  return request({
    url: '/main_store/sell/result/detail/' + path,
    method: 'get',
    params
  })
}
// post请求
// 新增销售申请订单
export function postSellApply(data) {
  return request({
    url: '/main_store/sell/apply',
    method: 'post',
    data
  })
}
// put请求
// 修改销售申请订单
export function putSellApply(data) {
  return request({
    url: '/main_store/sell/apply',
    method: 'put',
    data
  })
}
// 修改备注
export function putSellApplyRemark(params) {
  return request({
    url: '/main_store/sell/apply/remark',
    method: 'put',
    params
  })
}
// 红冲销售结果订单
export function postRedDashed(params) {
  return request({
    url: '/main_store/sell/result/redDashed',
    method: 'post',
    params
  })
}
// delete请求
export function delSellApply(params) {
  return request({
    url: '/main_store/sell/apply',
    method: 'delete',
    params
  })
}

