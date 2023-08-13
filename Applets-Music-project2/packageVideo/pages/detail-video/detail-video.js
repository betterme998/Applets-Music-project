// pages/detail-video/detail-video.js
import { getMVRel, getMVInfo, getMVRelate } from "../../../services/video"
import { search } from "../../../services/search"
Page({
    data:{
        id:0,
        artistName:'',
        mvUrl:"",
        mvInfos:{},
        relatedVideo:[],
        activeName: '1',
    },
    onLoad(options) {
        const id = options.id
        const artistName = options.artistName
        this.setData({id,artistName})

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
        const res2 = await search(this.data.artistName,10,1004)
        console.log(res);
        console.log(res2);
        this.setData({relatedVideo:res2.data.result.mvs})
    },
    // 点击事件
    onChange(event) {
        this.setData({
          activeName: event.detail,
        });
    },
})