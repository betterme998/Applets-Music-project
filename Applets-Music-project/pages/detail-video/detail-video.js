// pages/detail-video/detail-video.js
import { getMVRel, getMVInfo, getMVRelate } from "../../services/video"
Page({
    data:{
        id:0,
        mvUrl:"",
        mvInfos:{},
        relatedVideo:[],
        activeName: '1',
    },
    onLoad(options) {
        const id = options.id
        this.setData({id})

        this.fetchMVUrl()
        this.fetchMVInfo()
        this.fetchMVRelated()
    },
    // 2.请求数据
    async fetchMVUrl() {
        const res = await getMVRel(this.data.id)
        const mvUrl = res.data.data.url
        this.setData({ mvUrl })
        console.log(this.data.mvUrl);
    },
    async fetchMVInfo() {
        const res = await getMVInfo(this.data.id)
        // const mvInfos = res.data.data
        this.setData({ mvInfos:res.data.data })
        console.log(this.data.mvInfos);
    },
    async fetchMVRelated() {
        const res = await getMVRelate(this.data.id)
        this.setData({relatedVideo:res.data.data})
    },
    // 点击事件
    onChange(event) {
        this.setData({
          activeName: event.detail,
        });
    },
})