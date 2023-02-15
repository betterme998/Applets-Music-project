// pages/07_learn_cpns/index.js
Page({
  data:{
    digitalTitles:['电脑','手机','Ipad'],
    styleTitles:['流行','新款','热门']
  },
  onSectionInfoTitleClick(event) {
    console.log("组件title发送了点击",event.detail);
  },
  onTabIndexChange(event) {
    const index = event.detail
    console.log("点击了",this.data.digitalTitles[index]);
  },
  onTabIndexChange2(event) {
    const index = event.detail
    console.log("点击了",this.data.styleTitles[index]);
  },
  onEcecTCMthod(){
    // 1.获取对应的组件实例对象
    const tabControl = this.selectComponent(".tab-control")

    // 2.调用组件实例的方法
    tabControl.test(1)
  }
})