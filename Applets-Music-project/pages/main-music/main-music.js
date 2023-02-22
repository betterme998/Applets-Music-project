// pages/main-music/main-music.js
import { getMusicBanner } from "../../services/music"
import querySelect from "../../utils/query_select.js"
// 自己写的节流,可以用第三方库
import throttle from "../../utils/throttle"

// 进行节流
const querySelectThrottle = throttle(querySelect)
Page({
    data: {
        searchValue: "",
        banners:[],
        bannerHeight:150
    },
    onLoad() {
        this.fetchMusicBanner()
    },
    // 网络请求方法
    async fetchMusicBanner() {
         const res = await getMusicBanner()
         this.setData({  banners: res.data.banners })
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
*/ 