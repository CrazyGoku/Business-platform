import request from '@/utils/request'
// get请求
export function getWarehouses(params) {
  return request({
    url: '/main_store/warehouses',
    method: 'get',
    params
  })
}

// 按仓库查库存
export function getStockByWarehouse(params) {
  return request({
    url: '/main_store/storage/inventory/warehouse',
    method: 'get',
    params
  })
}

// 查询零售默认设置
export function getDefaultRetail(path) {
  return request({
    url: '/main_store/system/retail/' + path,
    method: 'get'
  })
}

// 修改零售默认设置
export function putDefaultRetail(data) {
  return request({
    url: '/main_store/system/retail',
    method: 'put',
    data
  })
}
