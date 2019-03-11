import request from '@/utils/request'
// 修改库存初期
export function putBankOpening(data) {
  return request({
    url: '/main_store/fund/bankAccount/opening',
    method: 'put',
    data
  })
}

// 获取银行账户
export function getBankFund(params) {
  return request({
    url: '/main_store/fund/bankAccount/opening',
    method: 'get',
    params
  })
}
