// components/mv-item/mv-item.js
import { debounce } from "../../utils/debounce"
Component({
    properties: {
        keyWorld:{
            type:String,
            value:''
        },
        songList:{
            type:Object,
            value:{}
        },
        videotab:{
            type:Boolean,
            value:false
        },
        index:{
            type:Number,
            value:0
        },
        videoPlay:{
            type:Object,
            value:{}
        },
        active:{
            type:Boolean,
            value:false
        }

    },
    data: {

    },
    // observers: {
    //     'videoPlay': function(videoPlay) {
    //         this.getvideoItem()
    //     }
    // },
    methods: {
        imageLoadFn:debounce(function(){
            this.triggerEvent('imageLoadComplete')
        },200)
    }
})
