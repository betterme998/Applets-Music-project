// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    pages: [
      {name:"01_初体验",path:"/pages/01_register_page/index"},
      {name:"02_常见组件",path:"/pages/02_common_cpns/index"},
      {name:"03_学习WXSS",path:"/pages/03_learn_wxss/index"},
      {name:"04_学习WXML",path:"/pages/04_learn_wxml/index"},
      {name:"05_学习WXS",path:"/pages/05_learn_wxs/index"},
      {name:"06_学习event",path:"/pages/06_learn_event/index"},
      {name:"07_学习组件化",path:"/pages/07_learn_cpns/index"}

    ]
  },
  onBtnClick(event) {
    // 1.获取item
    const item = event.target.dataset.item

    // 2.跳转路径
    wx.navigateTo({
      url: item.path,
    })
  }
})
