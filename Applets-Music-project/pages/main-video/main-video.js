// pages/main-video/main-video.js
import { getTopMVL } from "../../services/video"
import playerStore from "../../store/playerStore"
const app = getApp()
Page({
    data: {
       videoList:[],
       offset:0,
       hasMore: true,
       // tabbar高度
       tabbarHeight:0,

       // 播放栏
       playModeIndex:0,
       playSongIndex:0,
       playSongList:[],

       // 歌曲信息
       currentSong:{},
       isPlaying:false
    },
    onLoad() {
        var that = this
        var banners =wx.getStorageSync("banners")
        var videoList =wx.getStorageSync("videoList")
        // 时间
        var expiredTime =wx.getStorageSync('EXPIREDTIME')
        var now = +new Date()
        if ((now - expiredTime <=1*1*60*60*1000)&&videoList.length>0) {
            console.log("提前渲染视频");
            that.setData({
                videoList
            })
        }else{
            this.fetchTopMV()
        }

        this.setData({
            tabbarHeight: app.globalData.tabbarHeight
        })
        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)
    },
    // 发送网络请求的函数
    async fetchTopMV() {
        // 1.发送网络请求,获取数据
        const res = await getTopMVL(this.data.offset)
        // 2.将新数据追加到原数据后面
        const newVideoList = [...this.data.videoList,...res.data.data]
        // 3.设置全新数据
        this.setData({videoList:newVideoList})
        wx.setStorageSync('videoList',newVideoList)
        // 保持1天
        var expiredTime = +new Date() +1*1*60*60*1000
        wx.setStorageSync('EXPIREDTIME',expiredTime)
        this.data.offset = this.data.videoList.length
        this.data.hasMore = res.data.hasMore

        // 保存时间
        var expiredTime = +new Date() +1*1*60*60*1000
        console.log("重新加载");
    },
    // 监听上拉加载更多
    onReachBottom() {
        // 1.判断是否有更多的数据
        if (!this.data.hasMore) return
        // 2.有更多数据就请求更多数据
        this.fetchTopMV()
    },
    // 下拉刷新
    async onPullDownRefresh() {
        // 1.清空之前的数据
        this.setData({videoList : []})
        this.data.offset = 0
        this.data.hasMore = true
        // 2.重新请求新的数据
        await this.fetchTopMV()
        // 3.停止下拉刷新
        wx.stopPullDownRefresh()
        
    },
    
    
    //============================== 从Store中获取数据 ==============================
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
    onUnload() {
        playerStore.offState(["currentSong","isPlaying"], this.handlePlayInfos)
        playerStore.offState(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
    }

})