import axios from 'axios'
import { isLangZH, ui, jumpUrl, getPage } from '@/utils'
import { getToken, removeToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = getToken()
    config.headers['content-type'] = 'application/x-www-form-urlencoded'
    // config.data = config.data || {}
    // config.params = config.params || {}
    // config.params.adminToken = store.getters.token
    // config.data.adminToken = store.getters.token
    config.headers['token'] = getToken()
  }
  config.headers['deviceType'] = 3
  config.headers['lang'] = isLangZH() ? 0 : 1
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res.code && res.code !== '0') {
      // Message({
      //   message: res.info,
      //   type: 'error',
      //   duration: 3 * 1000
      // })
        // alert(JSON.stringify(res))
      if (res.code === '-1') { // token过期
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
          ui.tip({
              msg: res.info,
              callback: () => {
                  removeToken()
                  jumpUrl('login.html', {from: getPage()})
              }
          })
          // window.location.href='login.html'
      }
      return Promise.reject(res.info)
    } else {
      if (res.code) {
        return response.data
      } else {
        return response
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
      alert(error.message)
    return Promise.reject(error)
  })

export default service
