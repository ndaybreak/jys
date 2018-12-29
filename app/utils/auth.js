import Cookies from 'js-cookie'
import { getAccountInfo } from '@/api'
import { setSessionData, getSessionData, removeSessionData } from '@/data'

const TokenKey = 'A-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return new Promise((resolve, reject) => {
      let cookie = Cookies.set(TokenKey, token)
      getAccountInfo().then(res => {
          setSessionData('user', res.data)
          resolve(cookie)
      })
  })
}

export function removeToken() {
  removeSessionData('user')
  return Cookies.remove(TokenKey)
}
