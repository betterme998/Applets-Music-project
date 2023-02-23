// app.js
App({
    globalData: {
        screeWidth:375,
        screeHeight:667
    },
    onLaunch() {
        // 1.获取设备信息
        wx.getSystemInfo({
          success: (res) => {
              this.globalData.screeWidth = res.screenWidth
              this.globalData.screeHeight = res.screeHeight
          },
        })
    }
})
