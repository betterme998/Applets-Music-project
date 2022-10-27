// pages/favor/favor.js
// 实例化：页面实例
Page({
  data: {
    // 1.案例一：数据绑定mustache语法
    message:"hello world",
    // 2.案例二：列表数据
    movies:["少年派","大话西游","星际穿越","独行月球"],
    // 3.案例三：计数器案例
    counter:0
  },
  // 监听的事件方法
  increment(){
    // 修改data中的数据，并不会引起页面刷新，在小程序中不会，在react中也不会
    // this.data.counter += 1

    // 修改data，并且希望页面重新渲染，这里必须使用this.setData()
    this.setData({
      counter:this.data.counter+1
    })
  },
  decrement(){
    this.setData({
      counter:this.data.counter-1
    })
  }
})