// pages/profile/profile.js
Page({
  data: {
    avatarURL:"",
    listCount:30
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    console.log("用户进行了下拉刷新");
    this.setData({ listCount: 30 })
    // 模拟网络请求：定时器
    setTimeout(() => {
      // API:停止下拉刷新
      wx.stopPullDownRefresh({
        success: (res)=>{
          console.log("成功停止下来刷新",res);
        },
        fail: (err) => {
          console.log("失败停止下拉刷新");
        }
      })
    },100)
  },

  // 监听上拉加载更多
  onReachBottom() {
    console.log("onReachBottom");
    this.setData({
      listCount:this.data.listCount+30 
    })
  }
})