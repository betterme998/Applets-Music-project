// components/menu-list/menu-list.js
const app = getApp()
const tarbarHright = app.globalData.tabbarHeight
const devicePixelRatio = app.globalData.devicePixelRatio

Component({
    properties: {
        show:{
            type:Boolean,
            value:false
        }
    },
    data: {
        tarbarHright:0
    },
    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
            this.setData({tarbarHright:tarbarHright*devicePixelRatio})
            console.log(this.data.tarbarHright);
        }
      },
    methods: {
        onClose(){
            this.setData({ show: false });
        }
    }
})
