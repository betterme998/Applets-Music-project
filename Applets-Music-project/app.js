// app.js
App({
    globalData: {
        screeWidth:375,
        screeHeight:667,
        statusBarHeight:20,
        tabbarHeight:50,
        contentHeight:500,
        playSongIndex:0,
        menuHeight:0, //音乐页面高度
        menuRight:0,
        devicePixelRatio:2
    },
    onLaunch() {
        // 1.获取设备信息
        wx.getSystemInfo({
          success: (res) => {
              console.log(res);
            this.globalData.screeWidth = res.screenWidth
            this.globalData.screeHeight = res.screenHeight
            this.globalData.statusBarHeight = res.statusBarHeight
            this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
            //tabbar高度
            this.globalData.tabbarHeight = Number(res.screenHeight-res.safeArea.bottom) + 50
            this.globalData.devicePixelRatio = res.devicePixelRatio

            // 除tabbar 状态栏 导航栏外的高度
            this.globalData.menuHeight = res.screenHeight - res.statusBarHeight - 44 - (Number(res.screenHeight-res.safeArea.bottom) + 50)

            // 获取右上角胶囊信息
            let menu = wx.getMenuButtonBoundingClientRect()
            this.globalData.menuRight = res.screenWidth - menu.left
            console.log(this.globalData.menuRight);
          },
        })

    },
    onShow() {
        wx:wx.setKeepScreenOn({
          keepScreenOn: true,
          fail: () => {
            wx:wx.setKeepScreenOn({
              keepScreenOn: true
            })
          },
        })
    }
})
