// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore, { rankingsIds } from "../../store/rankingStore"
import { getPlaylistDetail } from "../../services/music"
import { debounce } from "../../utils/debounce"
import playerStore from "../../store/playerStore"
const app = getApp()
let startY = 0;//起始坐标
let moveY = 0;//移动坐标
let moveDistance = 0; //手指移动距离
Page({
    data: {
        type:"ranking",
        key:"newRanking",
        id:"",
        bgColor:[],
        songInfos: {},
        homeTop:0,
        bodyHeight:0,
        triggered:false,
        headerHeight:225,
        scrollTop:0,
        pullDown:true,
        // 歌单数据
        rankingInfos:{},
        // 播放工具栏
        // tabbar高度
       tabbarHeight:0,
       playModeIndex:0,
       playSongIndex:0,
       playSongList:[],
       // 歌曲信息
       currentSong:{},
       isPlaying:false,
    },
    onLoad(options) {
        this.setData({tabbarHeight: app.globalData.tabbarHeight})
        // 1.确定获取数据的类型
        // type:ranking ->榜单数据
        // type:recommend -> 推荐数据
        const type = options.type
        this.setData({type})

        // 获取store中榜单数据
        if (type === "ranking") {
            // 巅峰
            const key = options.key
            this.data.key = key
            rankingStore.onState(key,this.handleRanking)
        }else if (type === "recommend") {
            // 推荐歌曲
            recommendStore.onState("recommendSongInfo", this.handleRanking)
        }else if (type === "menu") {
            const id = options.id
            this.data.id = id
            this.fetchMenuSongInfo()
        }
        // 获取高度
        this.getNavTabHeight()

        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)
    },
    // onPageScroll(event){
    //     let that = this
    //     this.PageScrollFn(event,that)
    // },
    onPullDownRefresh(){
        wx.stopPullDownRefresh()
    },
    async fetchMenuSongInfo() {
        const res =  await getPlaylistDetail(this.data.id)
        console.log(res);
        this.setData({songInfos: res.data.playlist})
    },
    // ==============事件监听============
    onSongItemTap(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.songInfos.tracks)
        playerStore.setState("playSongIndex", index)

    },
    onBgColor(event) {
        let bgColor = event.detail
        this.setData({
            bgColor
        }),
        wx.setBackgroundColor({
            backgroundColor: this.data.bgColor[3],
            backgroundColorTop: this.data.bgColor[3], // 顶部窗口的背景色为白色
            backgroundColorBottom: this.data.bgColor[3], // 底部窗口的背景色为白色
        })
        this.getHeaderHeight()
    },
    onNavBackTap(){
        app.globalData.HomeFocus = false
        wx.navigateBack()
    },
    bindrefresherrefresh(){
        this.setData({
            triggered:false
        })
    },
    bindscroll(event){
        let that = this
        this.PageScrollFn(event,that)
    },
    // 获取nav+tab高度
    getNavTabHeight() {
        let query = wx.createSelectorQuery();
        query.select('.navCon').boundingClientRect(res =>{
            let homeTop = res?.height
            let bodyHeight = app.globalData.screeHeight - homeTop
            this.setData({
                homeTop:homeTop,
                bodyHeight:bodyHeight
            })
            
        }).exec();
        
    },
    // 获取header高度
    getHeaderHeight() {
        let query = wx.createSelectorQuery();
        wx.nextTick(()=>{
            query.select('#header').boundingClientRect(res =>{
                let headerHeight = res?.height
                this.setData({
                    headerHeight
                })
            }).exec();
        })
    },
    // 滚动
    PageScrollFn:debounce((event,that) =>{
        let scrollTop = event.detail.scrollTop
        if ( scrollTop < that.data.headerHeight*.3) {
            that.setData({
                scrollTop:0
            })
            // wx.pageScrollTo({
            //     scrollTop: 0,
            //     duration: 300
            // })
        }else if (scrollTop < that.data.headerHeight) {
            that.setData({
                scrollTop:that.data.headerHeight
            })
            // wx.pageScrollTo({
            //     scrollTop: that.data.headerHeight,
            //     duration: 300
            // })
        }
    },100),

    // ==============store共享数据=============

    handleRanking(value) {
        if (this.data.type === "recommend") {
            value.name = "推荐歌曲"
        }
        this.setData({songInfos:value})
        wx.setNavigationBarTitle({
          title: value.name,
        })
    },
    // 共享store 
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
        // playerStore.offState(["currentSong","isPlaying"], this.handlePlayInfos)
        // playerStore.offState(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        if (this.data.type === "ranking") {
            rankingStore.offState(this.data.key, this.handleRanking)
        }else if (this.data.type === "recommend") {
            recommendStore.offState("recommendSongInfo", this.handleRanking)
        }
    }
})