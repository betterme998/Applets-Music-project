// 封装成类 -> 实例
import { baseURL, mapUrl} from "./config"

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
        fail:(err) => {
          console.log(err);
        }
      })
    })
  }
  get(options) {
    return this.request({ ...options, method:"get" })
  }
  post(options) {
    return this.request({ ...options, method:"post" })
  }
}
class MapRequest {
    constructor(mapUrl) {
        this.mapUrl = mapUrl
    }
    request(options) {
        const { url } = options
        return new Promise((resolve, reject) => {
            wx.request({
                ...options,
                url: this.mapUrl + url,
                success: (res) => {
                    resolve(res)
                },
                fail:(err) => {
                    console.log(err);
                }
            })
        })
    }
    get(options) {
        return this.request({ ...options, method:"get" })
    }
}

export const hyRequest = new HYRequest(baseURL);
export const mapRequest = new MapRequest(mapUrl);