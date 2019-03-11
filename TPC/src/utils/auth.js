import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const StoreIdKey = 'Store-Id'
const UserIdKey = 'User-Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getStoreId() {
  return Cookies.get(StoreIdKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setStoreId(id) {
  return Cookies.set(StoreIdKey, id)
}
export function setUserId(id) {
  return Cookies.set(UserIdKey, id)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeStoreId() {
  return Cookies.remove(StoreIdKey)
}
export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
