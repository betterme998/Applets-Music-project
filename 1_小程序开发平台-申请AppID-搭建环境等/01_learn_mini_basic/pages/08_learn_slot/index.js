// pages/08_learn_slot/index.js
Page({
  data:{
    isShowLiftTime:true
  },
  onChangTap() {
    this.setData({
      isShowLiftTime:!this.data.isShowLiftTime
    })
  }
})