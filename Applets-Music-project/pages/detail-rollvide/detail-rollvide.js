// pages/detail-rollvide/detail-rollvide.js
import { getMVRel,getTopMVL } from "../../services/video"
const app = getApp()
Page({
    data: {
        id:'',
        mvInfos:'',
        mvlist:[],
        PreloadMv:[],
        videoPlay:{},
        index:0,
        current:0,
        mvComplete:false,
        imageShow:true
    },
    onLoad(options) {
        let a = decodeURIComponent(options.mvlist)
        let mvlist = JSON.parse(a)
        let id = options.id
        let index = options.index
        let key = options.keyworld
        this.setData({
            mvlist, 
            id,
            index,
            current:index,
            key
        })
        console.log(this.data.mvlist);
        this.getMv()
        this.getPreloadMv(this.getMvParameter())
    },
    onShow() {

    },
    onUnload() {

    },
    onNavBackTap(){
        app.globalData.HomeFocus = false
        wx.navigateBack()
    },
    bindchange(event){
        let current = event.detail.current
        this.setData({current})
        this.setData({
            mvComplete:false,
            imageShow:true,
            videoPlay:{},
            id:this.data.mvlist[this.data.current].id
        })
        this.getMv()
    },
    imageLoad(event){
        console.log(event);
    },
    mvplay(){
        this.setData({
            imageShow:false
        })
    },
    // 网络请求
    async getMv() {
        const res = await getMVRel(this.data.id)
        if (res.data.data.url) {
            this.setData({
                mvComplete:true,
                videoPlay:res.data.data
            })
        }
        console.log(res);
        // this.setData({mvInfos: res.data.playlist})
    },

    // 预加载视频
    getPreloadMv(fn) {
        let newMv = fn
        console.log(newMv);
        newMv.forEach(async (res) =>{
            await getMVRel(res.id).then(item=>{
                this.data.PreloadMv.push(item.data.data)
                console.log(this.data.PreloadMv);
            }).catch(()=>{
                PreloadMv.push('undefined')
            })

        })
    },
    // 预加载视频参数
    getMvParameter() {
        if (this.data.current >= 10) {
            let str = this.data.current - 10
            let end = this.data.current + 10
            let ParameterList = this.data.mvlist.slice(str,end)
            return ParameterList
        }else{
            let str = 0
            let end = this.data.current + 11
            let ParameterList = this.data.mvlist.slice(str,end)
            return ParameterList
        }
    }
})