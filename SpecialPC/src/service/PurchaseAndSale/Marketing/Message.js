import request from '@/utils/request'
//查询短信模版
export function getSmsTemplate(params) {
  return request({
    url: '/main_store/marketing/sms/template',
    method: 'get',
    params
  })
}

export function getSmsHistory(params) {
  return request({
    url: '/main_store/marketing/sms/history',
    method: 'get',
    params
  })
}

export function postSmsHistory(data) {
  return request({
    url: '/main_store/marketing/sms/history',
    method: 'post',
    data
  })
}

export function delSmsTemplate(params,path) {
  return request({
    url: '/main_store/marketing/sms/template/'+path,
    method: 'delete',
    params
  })
}
export function postSmsTemplate(data,path) {
  return request({
    url: '/main_store/marketing/sms/template/'+path,
    method: 'post',
    data
  })
}

export function putSmsTemplate(data,path) {
  return request({
    url: '/main_store/marketing/sms/template/'+path,
    method: 'put',
    data
  })
}
