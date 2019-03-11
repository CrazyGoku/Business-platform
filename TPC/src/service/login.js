import request from '@/utils/request'

export function loginAuth(params) {
  console.log(123)
  const data = {
    funcNo: '2026003',
    username: 'leb',
    password: 'hxsd!123',
    ...params
  }
  return request({
    url: '',
    method: 'get',
    data
  })
}
