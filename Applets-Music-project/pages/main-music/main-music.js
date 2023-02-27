// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import querySelect from "../../utils/query_select.js"
// 自己写的节流,可以用第三方库
import throttle from "../../utils/throttle"

// 进行节流
const querySelectThrottle = throttle(querySelect)
const app = getApp()
Page({
    data: {
        searchValue: "",
        banners:[],
        bannerHeight:150,
        recommendSongs:[],
        screenWidth:375,
        // 歌单数据
        hotMenuList:[],
        recMenuList:[]
    },
    onLoad() {
        this.fetchMusicBanner()
        this.fetchSongMenuList()

        // 监听数据变化，改变视图
        recommendStore.onState("recommendSongs",(value)=>{
            this.setData({ recommendSongs:value.slice(0, 6) })
        })
        // 发起action
        recommendStore.dispatch("fetchRecommendSongsAction")
        rankingStore.dispatch("fetchRankingDataAction")

        // 获取屏幕尺寸
        this.setData({screenWidth: app.globalData.screeWidth})
    },
    // 网络请求方法
    async fetchMusicBanner() {
         const res = await getMusicBanner()
         this.setData({  banners: res.data.banners })
    },
    async fetchSongMenuList() {
        getSongMenuList().then(res =>{
            this.setData({hotMenuList:res.data.playlists})
        })
        getSongMenuList("华语").then(res =>{
            this.setData({recMenuList:res.data.playlists})
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
        console.log(res);
        this.setData({ bannerHeight: res[0].height })
    },
    onRecommendMoreClick(){
        wx.navigateTo({
          url: '/pages/detail-song/detail-song',
        })
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