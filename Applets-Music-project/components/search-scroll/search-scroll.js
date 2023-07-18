// components/search-scroll/search-scroll.js
import { debounce } from "../../utils/debounce"
Component({
    // 多个插槽要加上这个
    options:{
        multipleSlots:true
    },
    properties: {
        tabsValue:{
            type:Array,
            value:[]
        },
        resultHeight:{
            type:Number,
            value:0
        },
        active:{
            type:Number,
            value:0
        }
    },
    data: {
    },
    lifetimes: {
        attached: function() {
             
        }
    },
    methods: {
        vanTabClick(event) {
            console.log(event);
            let index = event.detail.index
            this.triggerEvent("getTabItemValue",index)
        },
        bindscrolltolower(event){
            let name = event.currentTarget.dataset.name
            this.triggerEvent('onscrolltolowerb',name)
        },
        videoBindscroll:debounce((that)=>{
            that.triggerEvent('videoEvent')
        },500),
        videoEvent() {
            let that = this
            this.videoBindscroll(that)
        }
    }
})
