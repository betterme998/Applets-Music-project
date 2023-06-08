// pages/detail-rollvide/detail-rollvide.js
import { getMVRel,getTopMVL,getMVInfo } from "../../services/video"
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
        videoTime:0,
        videoHeight:0,
        videoTop:0,
        RollHeight:15,
        sliderBom:false,
        sliderb:true,
        sliderValue:0,
        mvInfo:{},
        iconText:true,
        rollNameWidth:0,
        rollLoopBom:false,
        animationName:'',
        noeRoll:false,
        speedtime:0,
        descHeight:0
    },
    async onLoad(options) {
        // 设置视频高度
        let videoHeight = app.globalData.screeWidth / 1.777
        
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
            videoHeight
        })
        
        this.getMv()
        this.getPreloadMv(this.getMvParameter())
        await this.getMVInfoFn(id)
        await this.getNavbar()
        this.getHeightImage()
        this.getRollHeight()
    },
    onShow() {

    },
    onUnload() {
        clearInterval(this.rollLoop)
    },
    onNavBackTap(){
        app.globalData.HomeFocus = false
        wx.navigateBack()
    },
    bindchange(event){
        let current = event.detail.current
        this.setData({current,mvInfo:{},iconText:true,speedtime:0,rollLoopBom:false,descHeight:0,animationName:''})
        this.setData({
            mvComplete:false,
            imageShow:true,
            videoPlay:{},
            videoTime:0,
            sliderValue:0,
            id:this.data.mvlist[this.data.current].id
        })
        this.getMv()

        // 获取mv详情
        this.getMVInfoFn(this.data.id)
    },
    onImageClick(){
        if (!this.data.iconText) {
            this.setData({
                iconText:true
            })   
        }
    },
    imageLoad(event){
        
    },
    getHeightImage(){
        let query = wx.createSelectorQuery();
        query.select('.image').boundingClientRect(res =>{
            if (res.height) {
                let height = res.height
                let videoTop = (app.globalData.screeHeight / 2 - height) + this.data.navHeight
                this.setData({
                    videoTop
                })
            }
        }).exec();
    },
    getNavbar(){
        let query = wx.createSelectorQuery();
        query.select('.navCon').boundingClientRect(res =>{
            let navHeight = res.height
            this.setData({navHeight})
        }).exec();
    },
    getRollHeight(){
        let query = wx.createSelectorQuery();
        query.select('.nameRoll').boundingClientRect(res =>{
            if (res.height) {
                let RollHeight = res.height
                this.setData({RollHeight})
            }
        }).exec();
    },
    getRollNameHeight(){
        let query = wx.createSelectorQuery();
        query.select('.textCons').boundingClientRect(res =>{
            let rollNameWidth = res.width
            if (rollNameWidth < 80) {
                rollNameWidth = 80
            }
            let speedtime = (Math.floor(rollNameWidth / 80) * 1000)
            this.setData({
                speedtime
            })
            console.log(this.data.speedtime);
            // 动态控制文本跑马灯效果停顿
            clearInterval(this.rollLoop)
            this.rollLoop = setInterval(() => {
                if (!this.data.noeRoll) {
                    this.setData({
                        noeRoll:true
                    })
                }
                this.data.rollLoopBom = !this.data.rollLoopBom
                if (this.data.rollLoopBom) {
                    this.setData({
                        animationName:'roll'
                    })
                }else{
                    this.setData({
                        animationName:'rolls'             
                    })
                }
                    
            },speedtime+2000)
        }).exec();
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
    // 收缩文章
    onIconText() {
        this.setData({
            iconText:false
        })
        console.log(this.data.iconText);
        let query = wx.createSelectorQuery();
        query.select('.textDesc').boundingClientRect(res =>{
            let descHeight  = res.height
            if ((descHeight > 250) && !this.data.iconText) {
                this.setData({
                    descHeight:250
                })
            }else{
                this.setData({
                    descHeight
                })
            }
        }).exec();

        
    },
    onIconTextContract(){
        this.setData({
            iconText:true
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
        // this.setData({mvInfos: res.data.playlist})
    },
    getMVInfoFn(id){
        console.log(id);
        getMVInfo(id).then(res =>{
            let mvInfo = res.data.data
            this.setData({
                mvInfo
            })
            this.getRollNameHeight()
            // this.setRollStop()
        })
        
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
        console.log(this.data.videoTime / 1000);
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
        if (!that.data.sliderBom) {
            that.data.sliderBom = true
        }
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