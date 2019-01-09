import request from '@/utils/request'
// get请求
// 库存预警查询
export function getInventoryWarhouse(params) {
  return request({
    url: '/pps/storage/inventory/warning',
    method: 'get',
    params
  })
}
// put请求
export function getInventoryWarning(params) {
  return request({
    url: '/pps/storage/inventory/warning',
    method: 'get',
    params
  })
}

