// app.js
App({
  onLaunch(options) {
    console.log(options);
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onShow(){
    console.log("onShow");
  },
  onHide(){
    console.log("onHide");
  },
  // 自定义数据列表
  // 都不是响应式的，这里共享的数据通常是一些固定的数据
  globalData: {
    token:'hasufhtolen',
    userInfo: {
      username:"123"
    }
  }
})
