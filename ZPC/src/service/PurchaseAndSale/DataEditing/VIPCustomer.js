import request from '@/utils/request'
// get请求
export function getCustomerData(params) {
  return request({
    url: '/main_store/clients',
    method: 'get',
    params
  })
}

export function getIntegralsDetails(params) {
  return request({
    url: '/main_store/clients/stores/detail',
    method: 'get',
    params
  })
}
export function getLevelData(params) {
  return request({
    url: '/main_store/clients/levels',
    method: 'get',
    params
  })
}
// 新增客户
export function postClients(data) {
  return request({
    url: '/main_store/clients',
    method: 'post',
    data
  })
}

// 查积分
export function getClientsIntegral(params) {
  return request({
    url: '/main_store/clients/stores',
    method: 'get',
    params
  })
}
// 修改积分

export function putClientsIntegral(data) {
  return request({
    url: '/main_store/clients/reduceIntegral',
    method: 'put',
    data
  })
}
