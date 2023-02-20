// pages/main-video/main-video.js
import { getTopMVL } from "../../services/video"
Page({
    data: {
       videoList:[],
       offset:0,
       hasMore: true
    },
    onLoad() {
        this.fetchTopMV()
    },
    // 发送网络请求的函数
    async fetchTopMV() {
        // 1.发送网络请求,获取数据
        const res = await getTopMVL(this.data.offset)
        // 2.将新数据追加到原数据后面
        const newVideoList = [...this.data.videoList,...res.data.data]
        // 3.设置全新数据
        this.setData({videoList:newVideoList})
        this.data.offset = this.data.videoList.length
        this.data.hasMore = res.data.hasMore
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
    // 事件监听

})