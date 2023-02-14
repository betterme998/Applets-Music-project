// pages/04_learn_wxml/index.js
Page({
  data: {
    message:"Hello World",
    firstname:"kobe",
    lastname:"bryant",
    date:new Date().toLocaleDateString(),
    score:95,
    isHidden:false,
    books:[
      { id:111, name: "代码大全", price: "98" },
      { id:112, name: "你不知道的JS", price: "87" },
      { id:113, name: "JS高级程序设计", price: "76" }
    ]
  },
  onChangeTap() {
    this.setData({
      isHidden:!this.data.isHidden
    })
  }
})