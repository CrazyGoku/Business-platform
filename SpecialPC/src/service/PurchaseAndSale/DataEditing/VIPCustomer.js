import request from '@/utils/request'
// get请求
export function getCustomerData(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}

export function getIntegralsDetails(params) {
  return request({
    url: '/pps/clients/stores/detail',
    method: 'get',
    params
  })
}
export function getLevelData(params) {
  return request({
    url: '/pps/clients/levels',
    method: 'get',
    params
  })
}
// 新增客户
export function postClients(data) {
  return request({
    url: '/pps/clients',
    method: 'post',
    data
  })
}

// 查积分
export function getClientsIntegral(params) {
  return request({
    url: '/pps/clients/stores',
    method: 'get',
    params
  })
}

// 启用禁用客户
export function putClientsDisabled(params,path) {
  console.log(params)
  return request({
    url: '/pps/clients/disabled/'+path,
    method: 'put',
    params
  })
}
