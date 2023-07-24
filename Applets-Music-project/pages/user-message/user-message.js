// pages/user-Message/user-message.js
import playerStore from "../../store/playerStore"
const app = getApp()
Page({
    data: {
        mvlist:{},
        // 播放栏
        tabbarHeight:0,
        playModeIndex:0,
        playSongIndex:0,
        playSongList:[],
        currentSong:{},
        isPlaying:false,

    },
    onLoad(options) {
        this.setData({tabbarHeight: app.globalData.tabbarHeight})
        // 处理传过来的数据
        let a = decodeURIComponent(options.user)
        let mvlist = JSON.parse(a)
        this.setData({mvlist})

        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)
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