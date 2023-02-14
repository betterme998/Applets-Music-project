// pages/02_common_cpns/index.js
Page({
  data:{
    message:"你好啊，李银河",
    chooseImageUrl:"",
    viewColors: ["red","blue","green","orange","purple","yellow"]
  },
  getUserInfo(event){
    // 调用API，获取用户的信息
    // 1.早期小程序的API，基本都不支持Promise风格
    // 2.后期小程序API，基本支持Promise风格
    wx.getUserProfile({
      desc: 'desc',
      // success:(res) => {
      //   console.log(res);
      // }
    }).then( res => {
      console.log(res);
    })
  },
  getPhoneNumber(event) {

  },
  onViewClick() {
    console.log("onViewClick");
  },
  onChooseImage(){
    wx.chooseMedia({
      mediaType: "image",
    }).then(res => {
      console.log(res);
      const imagePath = res.tempFiles[0].tempFilePath
      this.setData({chooseImageUrl: imagePath})
    })
  },
  // 监听scroll-view滚动
  onScrollToUpper(){
    console.log("滚动到最顶部/左边");
  },
  onScrollToLower(){
    console.log("滚动到最底部/右边");
  },
  onScroll(event){
    console.log("scrollView发生了滚动",event);
  }
})