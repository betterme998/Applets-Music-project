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
    return {
      title:"旅途的内容",
      path:"/pages/favor/favor",
      imageUrl:"/assets/nhlt.jpg"
    }
  },

  // 3.获取设备信息
  onGetSystemInfo(){
    // 1.获取手机的基本信息
    // wx.getSystemInfo({
    //   success: (result) => {
    //     console.log(result);
    //   },
    // })

    // 2.获取当前的位置信息
    wx.getLocation({
      success: (res) => {
        console.log(res);
      }
    })
  },

  // 4.本地存储方式
  onLocalStorage() {
    // 同步操作
    // 1.存储一些键值对
    wx.setStorageSync('name', "why")
    wx.setStorageSync('age', "18")
    wx.setStorageSync('friends', ["abc","cna","nba"])

    // 2.获取storage中内容
    // const name = wx.getStorageSync('name')
    // const age = wx.getStorageSync('age')
    // const friends = wx.getStorageSync('friends')
    // console.log(name, age, friends);

    // 3.删除storage中内容
    // wx.removeStorageSync('name')

    // 4.清空storage中内容
    // wx.clearStorageSync()

    // 异步操作
    wx.setStorage({
      key:"books",
      data:["vuejs程序设计","js高级数据","react高级设计"],
      // 加密
      encrypt:true,
      success:(res) => {
        wx.getStorage({
          key:"books",
          encrypt:true,
          success:(res) => {
            console.log(res);
          }
        })
      }
    })
    console.log("=====");
  }
})