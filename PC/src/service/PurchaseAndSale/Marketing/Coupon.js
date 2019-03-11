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
// 分页查询用户优惠券
export function getDiscountCouponByClient(params) {
  return request({
    url: '/pps/marketing/discountCoupon/clientId',
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

//作废优惠券
export function invalidDiscountCoupon(data) {
  return request({
    url: '/pps/marketing/discountCoupon/invalid',
    method: 'put',
    data
  })
}
//发放优惠券
export function giveDiscountCoupon(data) {
  return request({
    url: '/pps/marketing/discountCoupon/give',
    method: 'put',
    data
  })
}

