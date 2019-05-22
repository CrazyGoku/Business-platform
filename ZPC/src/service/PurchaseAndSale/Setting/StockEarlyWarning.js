import request from '@/utils/request'
// get请求
// 库存预警查询
export function getInventoryWarhouse(params) {
  return request({
    url: '/main_store/storage/inventory/warehouse',
    method: 'get',
    params
  })
}
// put请求
export function putInventoryWarning(data) {
  return request({
    url: '/main_store/storage/inventory/warning',
    method: 'put',
    data
  })
}

