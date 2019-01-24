import request from '@/utils/request'
//客户查询在各个店铺的积分、预收款余额、
export function getClientsStores(params) {
  return request({
    url: '/pps/clients/stores',
    method: 'get',
    params
  })
}
//查询店铺/客户明细关系
export function getClientsStoreDetail(params) {
  return request({
    url: '/pps/clients/stores/detail',
    method: 'get',
    params
  })
}
//查询该客户的下级在各个店铺的消费情况和该客户的提成情况
export function getClientsSubordinate(params) {
  return request({
    url: '/pps/clients/subordinate',
    method: 'get',
    params
  })
}
//查询该客户的下级在各个店铺的消费情况和该客户的提成情况
export function getClientsSubordinateDetail(path) {
  return request({
    url: '/pps/clients/subordinate/'+path,
    method: 'get'
  })
}
//修改客户资料
export function putClient(data) {
  return request({
    url: '/pps/clients',
    method: 'put',
    data
  })
}
//修改客户资料
export function getClient(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}
//积分或提成提现
export function postPushMoney(data) {
  return request({
    url: '/pps/clients/withdraw',
    method: 'post',
    data
  })
}
