// pages/user-Message/user-message.js
import playerStore from "../../store/playerStore"
import { debounce } from "../../utils/debounce"
const app = getApp()
Page({
    data: {
        mvlist:{},
        imageHeight:0,
        userHeight:0,
        // 播放栏
        tabbarHeight:0,
        playModeIndex:0,
        playSongIndex:0,
        playSongList:[],
        currentSong:{},
        isPlaying:false,

        // 下拉
        triggered:false,
        enableds:true,
        // bounces:false,

        // 动画
        activescroll:false,
        comeInfo:false,

        // 滑动方向
        numArr:[]

    },
    onLoad(options) {
        this.setData({tabbarHeight: app.globalData.tabbarHeight})
        // 处理传过来的数据
        let a = decodeURIComponent(options.user)
        let mvlist = JSON.parse(a)
        this.setData({mvlist})

        // 获取照片显示高度
        this.setData({
            imageHeight:app.globalData.screeWidth / 1.34,
            bodyHeight:app.globalData.screeHeight,
            scrollTop:app.globalData.screeHeight
        })

        // 获取内部滑块高度
        this.getUserInfosHeight()
        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)
    },
    onNavBackTap(){
        if (this.data.activescroll) {
            this.setData({
                activescroll:false,
                comeInfo:true
            })
        }else{
            app.globalData.HomeFocus = false
            wx.navigateBack()
        }
    },
    bindrefresherrefresh(){
        this.setData({
            triggered:false
        })
    },
    bindtouchmove(event){
        if (this.data.enableds) {
            let that = this
            let arr = [...this.data.numArr]
            arr.push(event.changedTouches[0].clientY)
            if (arr.length>2) {
                arr.shift()
            }
            this.data.numArr = arr
        }
    },
    bindrefresherrestore(){
        if (this.data.numArr[1]>=this.data.numArr[0]) {
            this.setData({
                activescroll:true,
                comeInfo:false
            })
        }
    },
    bindscroll(){
        if (this.data.enableds) {
            this.setData({
                enableds:false
            })
        }
    },
    bindscrolltoupper(){
        this.setData({
            enableds:true
        })
    },
    getUserInfosHeight(){
        let query = wx.createSelectorQuery();
        query.select('.userInfo').boundingClientRect(res =>{
            if (res.height > 0) {
                let userHeight = res.height
                this.setData({
                    userHeight
                })
            }
            
        }).exec();
    },
    onUnload(){
        app.globalData.HomeFocus = false

        playerStore.offStates(["currentSong","isPlaying"], this.handlePlayInfos)
        playerStore.offStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
    },
    getPlaySonginfosHandler({playSongList,playSongIndex,playModeIndex}) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
        if (playModeIndex !== undefined) {
            this.setData({ playModeIndex })
        }
    },
    handlePlayInfos({ currentSong, isPlaying }) {
        if (currentSong) {
            this.setData({currentSong})
        }
        if (isPlaying !== undefined) {
            this.setData({isPlaying})
        }
    },
})