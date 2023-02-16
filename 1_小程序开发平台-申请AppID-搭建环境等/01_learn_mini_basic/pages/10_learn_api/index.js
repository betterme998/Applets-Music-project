// pages/10_learn_api/index.js
Page({
  // 1.弹窗相关的API
  onShowToast(){
    wx.showToast({
      title: '购买成功！',
      icon:"error",
      duration:3000,
      success:(res) => {
        console.log("成功");
      },
      fail:(err)=>{
        console.log("err",err);
      }

    })
  },
  onShowModal(){
    wx.showModal({
      title: '确定购买吗？',
      content:"确定购买的话，请确定您微信有钱",
      confirmColor:"#f00",
      cancelColor:"#0f0",
      success:(res)=>{
        if (res.cancel) {
          console.log("用户点击取消");
        }else if (res.confirm) {
          console.log("用户点击了确定");
        }
      }
    })
  },
  onShowActionSheet(){
    wx.showActionSheet({
      itemList: ["衣服","裤子","鞋子"],
      success:(res) => {
        console.log(res);
      },
      fail:(err) => {
        console.log("取消",err);
      }
    })
  },

  // 2.分享功能
  onShareAppMessage() {
    
  }
})