import request from '@/utils/request'
// get请求
// 根据type查询申请单
export function getStorageApply(params) {
  return request({
    url: '/pps/storage/apply',
    method: 'get',
    params
  })
}

// 根据type查询申请单
export function postStorageApply(data) {
  return request({
    url: '/pps/storage/apply',
    method: 'post',
    data
  })
}

// 查询申请单详情
export function getStorageApplyDetail(params,path) {
  return request({
    url: '/pps/storage/apply/'+path,
    method: 'get',
    params
  })
}
