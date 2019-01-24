import request from '@/utils/request'
// 查询店铺/客户明细关系
export function getClientsStoresDetail(params) {
  return request({
    url: '/pps/clients/stores/detail',
    method: 'get',
    params
  })
}

//积分或提成提现审核
export function putClientsWithdrawAudit(data) {
  return request({
    url: '/pps/clients/withdraw/audit',
    method: 'put',
    data
  })
}

