import request from '@/utils/request'
// get请求
export function getMallOrder(params) {
  return request({
    url: '/main_store/mall/order',
    method: 'get',
    params
  })
}

export function getMallOrderReturn(params) {
  return request({
    url: '/main_store/mall/order/return',
    method: 'get',
    params
  })
}

export function putOrderReturnAudit(data) {
  return request({
    url: '/main_store/mall/order/return/audit',
    method: 'put',
    data
  })
}
export function putOrderReturnFinish(data) {
  return request({
    url: '/main_store/mall/order/return/finish',
    method: 'put',
    data
  })
}

// 行政区域管理

export function delRegion(params) {
  return request({
    url: '/main_store/mall/region',
    method: 'delete',
    params
  })
}

export function putRegion(data) {
  return request({
    url: '/main_store/mall/region',
    method: 'put',
    data
  })
}

export function postRegion(data) {
  return request({
    url: '/main_store/mall/region',
    method: 'post',
    data
  })
}

export function getCity(params) {
  return request({
    url: '/main_store/mall/region/city',
    method: 'get',
    params
  })
}

export function getDistrict(params) {
  return request({
    url: '/main_store/mall/region/district',
    method: 'get',
    params
  })
}

export function getProvince(params) {
  return request({
    url: '/main_store/mall/region/province',
    method: 'get',
    params
  })
}
// 查询抽奖记录
export function getMallIntegralDraw(params) {
  return request({
    url: '/main_store/mall/mallIntegralDraw',
    method: 'get',
    params
  })
}

// 查询抽奖记录
export function putMallIntegralDraw(params) {
  return request({
    url: '/main_store/mall/mallIntegralDraw',
    method: 'put',
    params
  })
}

// 修改客户级别会员卡号
export function putClient(data) {
  return request({
    url: '/main_store/mall/client',
    method: 'put',
    data
  })
}
