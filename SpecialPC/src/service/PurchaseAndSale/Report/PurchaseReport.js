import request from '@/utils/request'
// get请求
// 采购报表-商品采购分析-按商品
export function getReportProcurementByGoods(params) {
  return request({
    url: '/main_store/report/procurement/byGoods',
    method: 'get',
    params
  })
}

// 采购报表-供应商采购分析
export function getReportProcurementBySupplier(params) {
  return request({
    url: '/main_store/report/procurement/bySupplier',
    method: 'get',
    params
  })
}

// 采购报表-供应商采购分析
export function getReportProcurementOrderByDetail(params) {
  return request({
    url: '/main_store/report/procurement/order/byDetail',
    method: 'get',
    params
  })
}

// 采购报表-采购订单分析-按商品
export function getReportProcurementOrderByGoods(params) {
  return request({
    url: '/main_store/report/procurement/order/byGoods',
    method: 'get',
    params
  })
}
