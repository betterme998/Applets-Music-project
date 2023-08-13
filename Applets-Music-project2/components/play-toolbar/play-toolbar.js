// components/play-toolbar/play-toolbar.js
import playerStore from "../../store/playerStore";
const app = getApp()
Component({
    properties: {
        tabbarHeight:{
            type:Number,
            value:50
        },
        currentSong:{
            type:Object,
            value:{}
        },
        isPlaying:{
            type:Boolean,
            value:false
        },
        playModeIndex:{
            type:Number,
            value:0
        },
        playSongIndex:{
            type:Number,
            value:0
        },
        playSongList:{
            type:Array,
            value:[]
        }
    },
    data: {
        show:false,
    },
    lifetimes: {
        attached: function() {
            
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
    },
    methods: {
        onPlayBarAlbumTap() {
            const topBool = true
            wx.navigateTo({
              url: `/packagePlayer/pages/music-player/music-player?topBool=${topBool}`,
            })
        },
        onPlayOrPauseBtnTap() {
            // 播放栏
            playerStore.dispatch("playMusicStatusAction")
        },
        onchaShowFn() {
            this.setData({show:false})
        },
        showPopup() {
            this.setData({show:true})
        },
    }
})
