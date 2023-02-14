// pages/06_learn_event/index.js
Page({
  // 绑定事件监听函数
  onBtnClick(event){
    console.log("onBtnTap",event);
  },
  onOuterViewTap(event) {
    // 1.target触发事件元素
    // 2.currentTarget处理事件的元素
    console.log("onOuterViewTap",event);
    console.log(event.target);
    console.log(event.currentTarget);
    // 3.获取自定义属性:name
    const name = event.currentTarget.dataset.name
    console.log(name);
  },

  // 监听触摸事件
  onTouchTap(event){
    console.log("tap",event);
  },
  onLongPress(event){
    console.log("long",event);
  },
  onTouchEnd(event){
    console.log("end",event);
  }
})