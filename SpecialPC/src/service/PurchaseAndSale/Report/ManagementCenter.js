import request from '@/utils/request'
// get请求
//经营中心-老板中心
export function getReportManageByBoss(params) {
  return request({
    url: '/main_store/report/manage/byBoss',
    method: 'get',
    params
  })
}

//经营中心-资金经营分析
export function getReportManageByFund(params) {
  return request({
    url: '/main_store/report/manage/byFund',
    method: 'get',
    params
  })
}

//经营中心-库存经营分析
export function getReportManageByInventory(params) {
  return request({
    url: '/main_store/report/manage/byInventory',
    method: 'get',
    params
  })
}

//经营中心-利润经营分析
export function getReportManageByProfit(params) {
  return request({
    url: '/main_store/report/manage/byProfit',
    method: 'get',
    params
  })
}
//经营中心-销售经营分析
export function getReportManageBySell(params) {
  return request({
    url: '/main_store/report/manage/bySell',
    method: 'get',
    params
  })
}

//经营中心-往来经营分析
export function getReportManageByTarget(params) {
  return request({
    url: '/main_store/report/manage/byTarget',
    method: 'get',
    params
  })
}
