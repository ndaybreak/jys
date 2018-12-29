import { isJson } from '@/utils'

// 存储数据到sessionStorage中
export function setSessionData(key, value) {
    if(typeof value === 'object') {
        sessionStorage.setItem(key, JSON.stringify(value))
    } else {
        sessionStorage.setItem(key, value)
    }
}

// 获取存储在sessionStorage中的数据
export function getSessionData(key) {
    let value = sessionStorage.getItem(key)
    if(isJson(value)) {
        return JSON.parse(value)
    } else {
        return value
    }
}

// 获取存储在sessionStorage中的数据
export function removeSessionData(key) {
    sessionStorage.removeItem(key)
}
