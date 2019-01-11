import request from '@/utils/request'
// get请求
// 根据条件查询其他入/出库单、报溢/损单、成本调价单、库存盘点单
export function getStorageResult(params) {
  return request({
    url: '/pps/storage/result',
    method: 'get',
    params
  })
}

// 根据单据编号查询其他入/出库单、报溢/损单、成本调价单、库存盘点单详情
export function getStorageResultById(params, path) {
  return request({
    url: '/pps/storage/result/detail/' + path,
    method: 'get',
    params
  })
}
// 根据type查询所有收/发货单
export function getOrderStorage(params, path) {
  return request({
    url: '/pps/storage/notFinished/' + path,
    method: 'get',
    params
  })
}
// 红冲收/发货单
export function postRedDashed(data) {
  return request({
    url: '/pps/storage/redDashed',
    method: 'post',
    data
  })
}
// 新增其他入/出库单、报溢/损单、成本调价单、库存盘点单
export function postStorageResult(data) {
  return request({
    url: '/pps/storage/result',
    method: 'post',
    data
  })
}
// 红冲其他入/出库单、报溢/损单、成本调价单
export function redDashed(data) {
  return request({
    url: '/pps/storage/result/redDashed',
    method: 'post',
    data
  })
}
// 新增收/发货单接口
export function postStorage(data) {
  return request({
    url: '/pps/storage',
    method: 'post',
    data
  })
}

// 根据订单编号查看销售订单详情
export function getSellResultDetails(params, path) {
  return request({
    url: '/pps/sell/result/detail/' + path,
    method: 'get',
    params
  })
}
// 根据订单编号查看销售订单详情
export function getSellApplyDetails(params, path) {
  return request({
    url: '/pps/sell/apply/detail/' + path,
    method: 'get',
    params
  })
}
// 根据订单编号查看采购订单详情
export function getProcurementApplyDetails(params, path) {
  return request({
    url: '/pps/procurement/apply/detail/' + path,
    method: 'get',
    params
  })
}
