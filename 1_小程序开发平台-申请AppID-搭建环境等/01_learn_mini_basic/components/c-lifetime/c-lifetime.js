// components/c-lifetime/c-lifetime.js
Component({
  lifetimes:{
    created() {
      console.log("组件被创建");
    },
    attached(){
      console.log("组件被添加到组件树中");
    },
    detached(){
      console.log("组件从组件树中被移除");
    }
  },
  // 组件监听页面的生命周期
  pageLifetimes:{
    show(){
      console.log("页面显示出来");
    },
    hide(){
      console.log("页面隐藏啦");
    }
  }
})
