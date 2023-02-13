// pages/profile/profile.js
Page({
  data: {
    avatarURL:"",
    listCount:30
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
    this.setData({listCount:30})
    // 模拟网络请求：定时器
    setTimeout(()=>{
      // API：停止下拉刷新
      wx.stopPullDownRefresh({
        success: (res) => {
          console.log('成功停止',res);
        },
        fail:(err) => {
          console.log('失败',err);
        }
      })
    },1000)
  },

  // 监听上拉加载更多
  onReachBottom() {
    console.log("底部加载");
    this.setData({
      listCount:this.data.listCount + 30
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})