// pages/11_learn_nav/index.js
Page({
  data:{
    name:"kobe",
    age:30,
    massage:''
  },
  onNavTap(){
    const name = this.data.name
    const age = this.data.age
    // 页面导航操作
    wx.navigateTo({
      // 跳转的过程，传递一些参数过去
      url: `/pages2/detail/detail?name=${name}&age=${age}`,
      // 2.7版本后可以通过events，向上级/下级页面传递数据，其他页面可以回去这些函数，任何发送自定义事件并传递参数
      events:{
        backEvent(data) {
          console.log("back:",data);
        },
        betterme(data){
          console.log("better:",data);
        }
      }
    })
  }
})