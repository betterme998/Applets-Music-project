// pages2/detail/detail.js
Page({
  data:{
    name:"",
    age:0
  },
  onLoad(options) {
    // 接收页面跳转参数
    console.log(options);
    const name = options.name
    const age = options.age
    this.setData({name,age})
  },
  // 页面返回
  onBackTap(){
    // 1.返回导航
    wx.navigateBack({
      delta:1
    })

    // // 2.给上一级的页面传递数据--早期写法
    // // 2.1获取到上一个页面的实例 方式一
    // const pages = getCurrentPages()
    // const prePage = pages[pages.length-2]

    // // 2.2.通过setData给上一个页面设置数据
    // prePage.setData({massage:"哈哈哈"})
    // console.log(pages);

    // 3.方式二：回调events的函数
    // 3.1.拿到eventChannel
    const eventChannel = this.getOpenerEventChannel()

    // 3.2.通过eventChannnel回调函数
    eventChannel.emit("backEvent",{name:"back",age:111})
    eventChannel.emit("betterme",{name:"why",age:18})
  },
  onUnload() {
       // 2.给上一级的页面传递数据--早期写法
    // 2.1获取到上一个页面的实例
    const pages = getCurrentPages()
    const prePage = pages[pages.length-2]

    // 2.2.通过setData给上一个页面设置数据
    prePage.setData({massage:"哈哈哈"})
  }
})