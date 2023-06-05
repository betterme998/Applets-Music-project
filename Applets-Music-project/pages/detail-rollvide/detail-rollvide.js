// pages/detail-rollvide/detail-rollvide.js
import { getMVRel,getTopMVL } from "../../services/video"
import { debounce } from "../../utils/debounce"
import hythrottle from "../../utils/throttle"
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
        imageShow:true,
        newTime:'',
        videoTime:'00:00',
        videoHeight:0,
        videoTop:0,
        sliderBom:false,
        sliderb:true,
        sliderValue:0
    },
    onLoad(options) {
        // 设置视频高度
        let videoHeight = app.globalData.screeWidth / 1.777
        let videoTop = app.globalData.screeHeight * 0.3
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
            key,
            videoHeight,
            videoTop
        })
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
            videoTime:"00:00",
            sliderValue:0,
            id:this.data.mvlist[this.data.current].id
        })
        this.getMv()

        // 时间
        // this.formatTime(event.timeStamp)
    },
    imageLoad(event){
        
    },
    mvplay(event){
        let that = this
        let videoTime = event.currentTarget.dataset.time
        this.setData({
            imageShow:false,
            newTime:videoTime
        })

        // 操作视频
        let query = wx.createSelectorQuery();
        query.select('#video').boundingClientRect(res =>{
            that.videoContext = wx.createVideoContext('video',that)
        }).exec();
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
        // this.setData({mvInfos: res.data.playlist})
    },

    // 预加载视频
    getPreloadMv(fn) {
        let newMv = fn
        newMv.forEach(async (res) =>{
            await getMVRel(res.id).then(item=>{
                this.data.PreloadMv.push(item.data.data)
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
    },
    // 滑块
    bindchanging(res) {
        let that = this
        this.setVideoTime(res,that)
        this.setSliderStyle(res,that)
    },
    onSliderChange(res) {
        // 判断是否滑动
        if (!this.data.sliderBom) {
            let that = this
            const time = res.currentTarget.dataset.time
            this.setData({
                sliderb:false
            })
            this.setSliderStyle(res,that)

            // 1.获取点击的滑块位置对应的值
            const value = res.detail.value
            // 2.计算出要播放的时间
            const currentTime = value / 100 * time
            // 3.设置播放器，播放计算出的时间
            // audioContext.seek(currentTime / 1000)
            this.setData({videoTime:currentTime})
        }
        this.data.sliderBom = false  
        // 3.设置播放器，播放计算出的时间
        this.videoContext.seek(this.data.videoTime / 1000) 
    },
    setSliderStyle:debounce((res,that) =>{
        if (!that.data.sliderBom) {
            that.setData({
                sliderb:true
            })   
        }
    },2000),
    setVideoTime:hythrottle((res,that) =>{
        that.data.sliderBom = true
        const time = res.currentTarget.dataset.time
        // 1.获取点击的滑块位置对应的值
        const value = res.detail.value
        // 2.计算出要播放的时间
        const currentTime = value / 100 * time
        that.setData({videoTime:currentTime})
        if (that.data.sliderb) {
            that.setData({
                sliderb:false
            })   
        }
    },200)
})