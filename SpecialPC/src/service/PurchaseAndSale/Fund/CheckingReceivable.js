import request from '@/utils/request'
// 往来对账-查应收-按往来单位
export function getFundNeedOutByTarget(params) {
  return request({
    url: '/main_store/fund/needOut/byTarget',
    method: 'get',
    params
  })
}

// 往来对账-查应收-按往来单位-对账到单据
export function getFundNeedOutByTargetOrder(params) {
  return request({
    url: '/main_store/fund/needOut/byTargetOrder',
    method: 'get',
    params
  })
}
// 往来对账-职员部门应收款
export function getFundNeedOutByUser(params) {
  return request({
    url: '/main_store/fund/needOut/byUser',
    method: 'get',
    params
  })
}
