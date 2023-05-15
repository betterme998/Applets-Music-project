// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import rankingStore, {rankingsIds} from "../../store/rankingStore"
import querySelect from "../../utils/query_select.js"
// 自己写的节流,可以用第三方库
import throttle from "../../utils/throttle"

// 进行节流
const querySelectThrottle = throttle(querySelect)
const app = getApp()
Page({
    data: {
        servicesApi:true,
        searchValue: "",
        banners:[],
        bannerHeight:0,
        recommendSongs:[],
        screenWidth:375,
        // 歌单数据
        hotMenuList:[],
        recMenuList:[],
        isRankingDate:false,
        // 巅峰榜数据
        rankingInfos:{},

        // 当前正在播放的歌曲信息
        currentSong:{},
        isPlaying:false,

        // 播放栏
        show:false,
        playModeIndex:0,
        playSongIndex:0,
        playSongList:[],

        // 音乐高度
        menuHeight:0,
        // tabbar 高度
        tabbarHeight:50
    },
    onLoad() {

        var that = this
        var banners =wx.getStorageSync("banners")
        var hotMenuList =wx.getStorageSync("hotMenuList")
        var recMenuList =wx.getStorageSync("recMenuList")
        // 时间
        var expiredTime =wx.getStorageSync('EXPIREDTIME')
        let rankingInfos = wx.getStorageSync('rankingInfos')
        let recommendSongs = wx.getStorageSync('recommendSongs')
        var now = +new Date()
        if (now - expiredTime <=1*1*60*60*1000) {
            if (banners.length&&hotMenuList.length&&recMenuList.length&&recommendSongs.length) { // 本地如果有缓存列表，提前渲染
                that.setData({
                    banners,
                    hotMenuList,
                    recMenuList,
                    rankingInfos,
                    isRankingDate:true,
                    recommendSongs
                })
            }else{
                this.data.servicesApi = false
                that.fetchMusicBanner()
                that.fetchSongMenuList()
                recommendStore.dispatch("fetchRecommendSongsAction")
                rankingStore.dispatch("fetchRankingDataAction")
            }
        }else{
            this.data.servicesApi = false
            that.fetchMusicBanner()
            that.fetchSongMenuList()
            recommendStore.dispatch("fetchRecommendSongsAction")
            rankingStore.dispatch("fetchRankingDataAction")
        }
        if (this.data.servicesApi) {
            that.fetchMusicBanner()
            that.fetchSongMenuList()
            recommendStore.dispatch("fetchRecommendSongsAction")
            rankingStore.dispatch("fetchRankingDataAction")
        }
        recommendStore.onState("recommendSongInfo",this.handleRecommendSongs)

        // 高阶用法
        for (const key in rankingsIds) {
            rankingStore.onState(key,this.getRankingHanlder(key))
        }
        // ===============================================

        

        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)

        // 获取屏幕尺寸
        this.setData({
            screenWidth: app.globalData.screeWidth,
            menuHeight: app.globalData.menuHeight * app.globalData.devicePixelRatio,
            tabbarHeight: app.globalData.tabbarHeight
        })
        console.log(111111111);
        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
    },
    // 网络请求方法
    async fetchMusicBanner() {
         getMusicBanner().then(res =>{
            this.setData({  banners: res.data.banners })
            wx.setStorageSync('banners',res.data.banners)

            // 保持1天
            var expiredTime = +new Date() +1*1*60*60*1000
            wx.setStorageSync('EXPIREDTIME',expiredTime)
         })
    },
    async fetchSongMenuList() {
        getSongMenuList().then(res =>{
            this.setData({hotMenuList:res.data.playlists})
            wx.setStorageSync('hotMenuList',res.data.playlists)
        })
        getSongMenuList("华语").then(res =>{
            this.setData({recMenuList:res.data.playlists})
            wx.setStorageSync('recMenuList',res.data.playlists)
        })
    },


    // 界面事件监听方法
    // 跳转搜索页面
    onSearchClick() {
        wx.navigateTo({url: '/pages/detail-search/detail-search'})
    },
    async onBannerImageLoad(event) {
        // 获取图片加载完成后高度，通过回调封装好的api。使用了promise方式
        const res = await querySelectThrottle(".banner-image")
        this.setData({ bannerHeight: res[0].height })
    },
    onRecommendMoreClick(){
        wx.navigateTo({
          url: '/pages/detail-song/detail-song?type=recommend',
        })
    },
    onSongItemTap(event){
        // 1.拿到播放列表. 放到store的第三方库中
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList",this.data.recommendSongs)
        playerStore.setState("playSongIndex",index)
    },
    onPlayOrPauseBtnTap() {
        // 播放栏
        playerStore.dispatch("playMusicStatusAction")
    },
    onPlayBarAlbumTap() {
        const topBool = true
        wx.navigateTo({
          url: `/pages/music-player/music-player?topBool=${topBool}`,
        })
    },
    onchaShowFn() {
        this.setData({show:false})
    },
    showPopup() {
        this.setData({show:true})
    },

    //============================== 从Store中获取数据 ==============================
    handleRecommendSongs(value) {
        if (!value.tracks) return
        this.setData({ recommendSongs:value.tracks.slice(0, 6) })
        wx.setStorageSync('recommendSongs',value.tracks.slice(0, 6))
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

    // 高阶用法
    getRankingHanlder(ranking) {
        return value => {
            if (!value.name) return
            this.setData({ isRankingDate:true })
            const newRankingInfos = { ...this.data.rankingInfos, [ranking]:value}
            this.setData({ rankingInfos: newRankingInfos })
            wx.setStorageSync('rankingInfos',newRankingInfos)
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
        recommendStore.offState("recommendSongs",this.handleRecommendSongs)
        rankingStore.offState("newRanking",this.getRankingHanlder)
        rankingStore.offState("originRanking",this.getRankingHanlder)
        rankingStore.offState("upRanking",this.getRankingHanlder)

        playerStore.offState(["currentSong","isPlaying"], this.handlePlayInfos)
        playerStore.offState(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
    }
})
/*
    轮播图：1.请求轮播图数据并展示，会发现图片不匹配，导致下标小圆点不在图片上。
            解决办法：图片加载完成后，使用wx.createSelectorQuery() api 获取图片高度，
                    并在wxml页面在swper标签上使用style 来绑定获取的图片高度
                上面过程存在缺陷：
                    1.wx.createSelectorQuery() api使用繁琐，
                    2.图片不止一张，会多次执行获取操作
            优化：1.封装获取图片高度的方法，通过回调函数返回promise实现。
                 2.使用节流函数，进行节流
    
    小程序两个不同页面共享数据
    使用第三方库hy-event-store 来完成

*/ 