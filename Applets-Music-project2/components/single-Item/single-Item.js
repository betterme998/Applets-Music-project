// components/single-Item/single-Item.js
import playerStore from "../../store/playerStore"
Component({
    properties: {
        singleValue:{
            type:Object,
            value:{}
        },
        keyWorld:{
            type:String,
            value:''
        },
        underline:{
            type:Boolean,
            value:true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSingleItem() {
            let id = this.properties.singleValue.id
            if(id) {
                wx.navigateTo({
                    url: `/packagePlayer/pages/music-player/music-player?id=${id}`
                })
            }
        }
    }
})
