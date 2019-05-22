import request from '@/utils/request'
// get请求
// 库存报表-进销存分析-其他出入库分析/报损报溢分析
export function getReportInventoryAnalysis(params, path) {
  return request({
    url: '/main_store/report/inventory/analysis/' + path,
    method: 'get',
    params
  })
}

// 库存报表-进销存分析-按商品
export function getReportInventoryAnalysisByGoods(params) {
  return request({
    url: '/main_store/report/inventory/byGoods',
    method: 'get',
    params
  })
}
// 库存报表-进销存分析-按商品-仓库
export function getReportInventoryAnalysisByGoodsWarehouse(params) {
  return request({
    url: '/main_store/report/inventory/byGoodsWarehouse',
    method: 'get',
    params
  })
}

// 库存报表-出入库明细
export function getReportInventoryAnalysisByDetails(params) {
  return request({
    url: '/main_store/report/inventory/details',
    method: 'get',
    params
  })
}
