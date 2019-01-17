import request from '@/utils/request'
// 往来对账-查应收-按往来单位
export function getFundNeedInByTarget(params) {
  return request({
    url: '/pps/fund/needIn/byTarget',
    method: 'get',
    params
  })
}

// 往来对账-查应收-按往来单位-对账到单据
export function getFundNeedInByTargetOrder(params) {
  return request({
    url: '/pps/fund/needIn/byTargetOrder',
    method: 'get',
    params
  })
}
// 往来对账-职员部门应收款
export function getFundNeedInByUser(params) {
  return request({
    url: '/pps/fund/needIn/byUser',
    method: 'get',
    params
  })
}
