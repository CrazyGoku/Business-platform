import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}
export function getOrderApply(params) {
  return request({
    url: '/pps/procurement/apply',
    method: 'get',
    params
  })
}
// 查看订单详情
export function getOrderApplyDetails(params, path) {
  return request({
    url: '/pps/procurement/apply/detail/' + path,
    method: 'get',
    params
  })
}
// 添加订单
export function postOrderApply(data) {
  return request({
    url: '/pps/procurement/apply',
    method: 'post',
    data
  })
}
// 修改订单
export function putOrderApply(data) {
  return request({
    url: '/pps/procurement/apply',
    method: 'put',
    data
  })
}
// delete请求
export function delOrderApply(params) {
  return request({
    url: '/pps/procurement/apply',
    method: 'delete',
    params
  })
}
// 红冲采购结果订单
export function postRedDashed(data) {
  return request({
    url: '/pps/procurement/result/redDashed',
    method: 'post',
    data
  })
}
