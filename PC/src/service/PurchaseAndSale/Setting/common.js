import request from '@/utils/request'
// get请求
export function getWarehouses(params) {
  return request({
    url: '/pps/warehouses',
    method: 'get',
    params
  })
}

// 按仓库查库存
export function getStockByWarehouse(params) {
  return request({
    url: '/pps/storage/inventory/warehouse',
    method: 'get',
    params
  })
}
