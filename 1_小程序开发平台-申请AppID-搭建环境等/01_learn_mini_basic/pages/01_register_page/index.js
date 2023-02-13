// pages/01_初体验/index.js
Page({
  data: {
    banner:[],
    recommend:[],

    // 2.作用二：定义本地固定数据
    counter:100,

    btns:["red","blue","green","orange"]
  },
  // 1.作用一：发送网络请求
  onLoad() {
    console.log('onLoad');
    wx.request({
      url: "http://123.207.32.32:8000/home/multidata",
      success: (res) => {
        const data = res.data.data
        const banner = data.banner.list
        const recommend = data.recommend.list
        this.setData({banner,recommend})
      }
    })
  },

  // 3.绑定wxml中产生事件后的回调
  onBtn1Click() {
    console.log('111');
  },
  onBtnClick(event) {
    console.log("btn click",event.target.dataset.color);
  },

  // 4.绑定下拉刷新/达到底部/页面滚动
  onPullDownRefresh() {
    console.log("onPullDownRefresh 下拉刷新");
  },
  onReachBottom() {
    console.log("onReachBottom 上拉加载更多");
  },
  onPageScroll(event) {
    console.log("onPageScroll 页面滚动",event);
  },

  // 生命周期
  onShow() {
    console.log("onShow");
  },
  onReady() {
    console.log("onReady");
  },
  onHide() {
    console.log("onHide");
  },
  onUnload() {
    console.log("onUnload");
  }

})