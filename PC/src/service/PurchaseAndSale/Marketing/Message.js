import request from '@/utils/request'
//查询短信模版
export function getSmsTemplate(params) {
  return request({
    url: '/pps/marketing/sms/template',
    method: 'get',
    params
  })
}

export function getSmsHistory(params) {
  return request({
    url: '/pps/marketing/sms/history',
    method: 'get',
    params
  })
}

export function postSmsHistory(data) {
  return request({
    url: '/pps/marketing/sms/history',
    method: 'post',
    data
  })
}
