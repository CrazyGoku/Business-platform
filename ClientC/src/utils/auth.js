import Cookies from 'js-cookie'

const TokenKey = 'Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get('userid')
}

export function setId(username) {
  return Cookies.set('userid', username, { expires: 1 })
}

export function removeId() {
  return Cookies.remove('userid')
}
