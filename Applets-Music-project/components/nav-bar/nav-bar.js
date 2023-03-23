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
        },
        rightShoe: {
            type:Boolean,
            value:false
        }
    },
    data: {
        statusHeight:20,
        menuRight:0
    },
    lifetimes:{
        attached() {
            this.setData({
                statusHeight:app.globalData.statusBarHeight,
                menuRight:app.globalData.menuRight * app.globalData.devicePixelRatio
            })
        }
    },
    methods: {
        onLeftClick() {
            this.triggerEvent("leftclick")
        }
    }
})
