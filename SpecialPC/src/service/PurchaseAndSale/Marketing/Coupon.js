import request from '@/utils/request'
// get请求
// 分页查询优惠券
export function getDiscountCoupon(params) {
  return request({
    url: '/pps/marketing/discountCoupon',
    method: 'get',
    params
  })
}

// 新增优惠券
export function postDiscountCoupon(data) {
  return request({
    url: '/pps/marketing/discountCoupon',
    method: 'post',
    data
  })
}
// 新增优惠券
export function putDiscountCoupon(data) {
  return request({
    url: '/pps/marketing/discountCoupon',
    method: 'put',
    data
  })
}

// 新增优惠券
export function invalidDiscountCoupon(data) {
  return request({
    url: '/pps/marketing/discountCoupon/invalid',
    method: 'put',
    data
  })
}

