// components/menu-list/menu-list.js
import playerStore, {audioContext} from "../../store/playerStore"

const app = getApp()
const tarbarHright = app.globalData.tabbarHeight
const devicePixelRatio = app.globalData.devicePixelRatio

Component({
    properties: {
        show:{
            type:Boolean,
            value:false
        },
        playSongList:{
            type:Array,
            value:[]
        },
        playModeIndex:{
            type:Number,
            value:0
        },
        playSongIndex:{
            type:Number,
            value:0
        }
    },
    data: {
        tarbarHright:0,
        ClickIndex:0,
        modeNames: ["icon-xunhuanbofang", "icon-danquxunhuan", "icon-suijibofang"],
        modeName: ["列表循环", "单曲循环", "随机播放"]
    },
    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
            this.setData({
                tarbarHright:tarbarHright*devicePixelRatio,
            })
        }
    },
    methods: {
        onClose(){
            this.triggerEvent('onchaShow')
        },
        onModeBtnTap(){
            playerStore.dispatch("changPlayModeAcyion")
        },
        onlistMenuFn(event) {
            const index = event.currentTarget.dataset.index
            const id = event.currentTarget.dataset.id
            // 修改store中的playSongIndex
            playerStore.setState("playSongIndex",index)
            playerStore.dispatch("playMusicWithSongId", id)
        }
    }
})
