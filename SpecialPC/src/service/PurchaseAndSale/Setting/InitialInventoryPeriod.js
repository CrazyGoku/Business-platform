import request from '@/utils/request'
// 修改库存初期
export function putInventoryOpening(data) {
  return request({
    url: '/pps/storage/inventory/opening',
    method: 'put',
    data
  })
}
