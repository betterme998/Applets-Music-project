// pages/detail-video/detail-video.js
import { getMVRel, getMVInfo } from "../../services/video"
Page({
    data:{
        id:0,
        mvUrl:"",
        mvInfos:{}
    },
    onLoad(options) {
        const id = options.id
        this.setData({id})
        console.log(typeof(id));

        this.fetchMVUrl()
    },
    // 2.请求数据
    async fetchMVUrl() {
        const res = await getMVRel(this.data.id)
        const mvUrl = res.data.data.url
        this.setData({ mvUrl })
        console.log(this.data.mvUrl);
    },
    async fetchMVInfo() {

    }
})