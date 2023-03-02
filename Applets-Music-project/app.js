// app.js
App({
    globalData: {
        screeWidth:375,
        screeHeight:667,
        statusBarHeight:20,
        contentHeight:500
    },
    onLaunch() {
        // 1.获取设备信息
        wx.getSystemInfo({
          success: (res) => {
              this.globalData.screeWidth = res.screenWidth
              this.globalData.screeHeight = res.screenHeight
              this.globalData.statusBarHeight = res.statusBarHeight
              this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
          },
        })
    }
})
