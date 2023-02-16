// 封装成函数
export function hyrequest(options){
  return new Promise((resolve,reject) => {
    wx.request({ 
      ...options,
      success:(res) => {
        resolve(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

// 封装成类 -> 实例
class HYRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url:this.baseURL + url,
        success: (res) => {
          resolve(res)
        },
        fail:reject
      })
    })
  }
  get(options) {
    return this.request({ ...options,method:"get" })
  }
  post(options) {
    return this.request({ ...options, method:"post" })
  }
}

export const hyReqInstance = new HYRequest("http://123.207.32.32:1888/api")
