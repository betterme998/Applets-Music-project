// components/menu-area/menu-area.js
const app = getApp()
Component({
    properties: {
        menuList:{
            type:Array,
            value:[]
        },
        title:{
            type:String,
            value:'默认歌单'
        }
    },
    data:{
        screenWidth:375
    },
    lifetimes:{
        attached() {
            this.setData({ screenWidth: app.globalData.screeWidth })
        }
    },
    methods: {
        onMenuMoreClick() {
            wx.navigateTo({
              url: '/pages/detail-menu/detail-menu',
            })
        }
    }
})
