import request from '@/utils/request'
// get请求
export function getStorageInventoryCurrent(params) {
  return request({
    url: '/pps/storage/inventory/current',
    method: 'get',
    params
  })
}

export function getStorageInventoryCurrentSku(params) {
  return request({
    url: '/pps/storage/inventory/current/sku',
    method: 'get',
    params
  })
}

export function getStorageInventoryCurrentCheck(params) {
  return request({
    url: '/pps/storage/inventory/current/check',
    method: 'get',
    params
  })
}

export function getStorageInventoryCurrentDistribution(params) {
  return request({
    url: '/pps/storage/inventory/current/distribution',
    method: 'get',
    params
  })
}
//按仓库查库存
export function getStorageInventoryWarehouse(params) {
  return request({
    url: '/pps/storage/inventory/warehouse',
    method: 'get',
    params
  })
}

//按属性查库存
export function getStorageInventorySku(params) {
  return request({
    url: '/pps/storage/inventory/sku',
    method: 'get',
    params
  })
}

//根据商品规格编号查对账
export function getStorageInventorySkuCheck(params) {
  return request({
    url: '/pps/storage/inventory/sku/check',
    method: 'get',
    params
  })
}

//根据商品规格编号查分布
export function getStorageInventorySkuDistribution(params) {
  return request({
    url: '/pps/storage/inventory/sku/distribution',
    method: 'get',
    params
  })
}

//根据商品规格编号和仓库编号查对账
export function getStorageInventoryWarehouseCheck(params) {
  return request({
    url: '/pps/storage/inventory/warehouse/check',
    method: 'get',
    params
  })
}
