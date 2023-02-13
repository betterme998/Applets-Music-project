// app.js
App({
    // 自定义数据列表
  // 都不是响应式的，这里共享的数据通常是一些固定的数据
  globalData: {
    token:'',
    userInfo: {}
  },
  onLaunch(options) {
    console.log(options);
    // 登录

    // 0.从本地获取token/userInfo
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    // 1.进行登录操作（判断逻辑）
    if (!token || !userInfo) {
      console.log("登录操作");
      // 登录成功的数据，保存到storage
      wx.setStorageSync('token', "betterme")
      wx.setStorageSync('userInfo', {nickname: "kobe",level:100}) 
    }

    // 2.将获取到数据保存到globalData中
    this.globalData.token = token
    this.globalData.userInfo = userInfo

    // 3.发送网络请求，优先请求那一些必要数据
    // wx.request({url: 'url'})

  }
})
