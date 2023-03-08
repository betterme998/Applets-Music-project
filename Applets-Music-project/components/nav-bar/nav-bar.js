// components/nav-bar/nav-bar.js
const app = getApp()
Component({
    // 多个插槽要加上这个
    options:{
        multipleSlots:true
    },
    properties:{
        title: {
            type:String,
            value:"导航标题"
        }
    },
    data: {
        statusHeight:20
    },
    lifetimes:{
        attached() {
            this.setData({statusHeight:app.globalData.statusBarHeight})
        }
    },
    methods: {
        onLeftClick() {
            this.triggerEvent("leftclick")
        }
    }
})
