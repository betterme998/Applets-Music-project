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
        videoMaxTime:0,
        videoHeight:0,
        RollHeight:15,
        sliderBom:false,
        clickSlider:false,
        sliderDebounce:true,
        sliderb:true,
        sliderValue:0,
        mvInfo:{},
        iconText:true,
        PauseBom:false,
        rollNameWidth:0,
        rollLoopBom:false,
        animationName:'',
        noeRoll:false,
        speedtime:0,
        descHeight:0,
        getVideoBom:false,
        bottomHeight:0,
        sliderConHeight:0,
        navHeight:0,
        isPlaying:true
    },
    async onLoad(options) {
        // 设置视频高度
        let videoHeight = app.globalData.screeWidth / 1.777
        let bottomHeight = app.globalData.tabbarHeight
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
            bottomHeight
        })
        
        this.getMv()
        this.getSliderCon()
        // this.getPreloadMv(this.getMvParameter())
        await this.getMVInfoFn(id)
        await this.getNavbar()
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
    bindchangeSwiper(event){
        let current = event.detail.current
        this.data.clickSlider = false
        this.data.getVideoBom = false
        this.setData({current,mvInfo:{},iconText:true,speedtime:0,rollLoopBom:false,descHeight:0,animationName:'',sliderb:true})
        this.setData({
            mvComplete:false,
            imageShow:true,
            videoPlay:{},
            videoTime:0,
            videoMaxTime:0,
            sliderValue:0,
            id:this.data.mvlist[this.data.current].id
        })
        this.getMv()

        // 获取mv详情
        this.getMVInfoFn(this.data.id)
    },
    onImageClick(){
        let query = wx.createSelectorQuery();
        if (this.data.iconText) {
            if (this.data.PauseBom) {
                query.select('#video').boundingClientRect(res =>{
                    console.log(res);
                    let videoContext = wx.createVideoContext('video')
                    // 3.设置播放器，播放计算出的时间
                    videoContext.play()
                    this.setData({
                        PauseBom:false,
                        isPlaying:true
                    })   
                    console.log('播放');
                }).exec();
    
            }else{
                query.select('#video').boundingClientRect(res =>{
                    console.log(res);
                    let videoContext = wx.createVideoContext('video')
                    // 3.设置播放器，播放计算出的时间
                    videoContext.pause()
                    this.setData({
                        PauseBom:true,
                        isPlaying:false
                    })   
                    console.log('暂停');   
                }).exec();
            }
        }else{
            this.setData({
                iconText:true
            })
        }



        // if (this.data.PauseBom && this.data.iconText) {
        //     query.select('#video').boundingClientRect(res =>{
        //         console.log(res);
        //         let videoContext = wx.createVideoContext('video')
        //         // 3.设置播放器，播放计算出的时间
        //         videoContext.play()
        //         this.setData({
        //             PauseBom:true
        //         })   
        //     }).exec();
        // }else{
        //     query.select('#video').boundingClientRect(res =>{
        //         console.log(res);
        //         let videoContext = wx.createVideoContext('video')
        //         // 3.设置播放器，播放计算出的时间
        //         videoContext.pause()
        //         this.setData({
        //             PauseBom:false
        //         }) 
        //     }).exec();
        // }
        

    },
    onPause(){
        let query = wx.createSelectorQuery();
        query.select('#video').boundingClientRect(res =>{
            let videoContext = wx.createVideoContext('video')
            // 3.设置播放器，播放计算出的时间
            videoContext.play()
            this.setData({
                PauseBom:false
            })   
        }).exec();
    },
    getImageInfo(event){
        let query = wx.createSelectorQuery();
        query.select('#video').boundingClientRect(res =>{
            console.log(res);
        }).exec();
    },
    // getHeightImage(){
    //     let query = wx.createSelectorQuery();
    //     query.select('.image').boundingClientRect(res =>{
    //         if (res.height) {
    //             let height = res.height
    //             let videoTop = (app.globalData.screeHeight / 2 - height) + this.data.navHeight
    //             this.setData({
    //                 videoTop
    //             })
    //         }
    //     }).exec();
    // },
    getNavbar(){
        let query = wx.createSelectorQuery();
        query.select('.navCon').boundingClientRect(res =>{
            if (res.height) {
                let navHeight = res.height / 2
                this.setData({navHeight})
            }
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
    getSliderCon() {
        let query = wx.createSelectorQuery();
        query.select('.sliderCon').boundingClientRect(res =>{
            if (res.height) {
                let sliderConHeight = res.height / -2
                this.setData({sliderConHeight})

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
        let videoTime = event.currentTarget.dataset.time
        this.setData({
            newTime:videoTime
        })
    },
    onBindtimeupdate:hythrottle((event,that)=>{
        let sliderTime = (event.detail.currentTime / event.detail.duration) * 100
        if (!that.data.clickSlider || that.data.sliderb){
            that.setData({
                sliderValue:sliderTime
            }) 
        }
    },1000),
    setSliderTimeFn(event){
        let that = this
        this.onBindtimeupdate(event,that)
    },
    bindloadedmetadata(event) {
        let videoHeightItem = (event.detail.height / event.detail.width) * app.globalData.screeWidth
        this.setData({
            videoHeightItem:videoHeightItem,
            imageShow:false
        })
        console.log(videoHeightItem);
    },
    // 收缩文章
    onIconText() {
        this.setData({
            iconText:false
        })
        let query = wx.createSelectorQuery();
        query.select('.textDesc').boundingClientRect(res =>{
            let descHeight  = 0
            if (res.height) {
                descHeight = res.height
            }
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
        console.log(res);
        if (res.data.data.url) {
            this.setData({
                mvComplete:true,
                videoPlay:res.data.data
            })
        }
        // this.setData({mvInfos: res.data.playlist})
    },
    getMVInfoFn(id){
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
    // getPreloadMv(fn) {
    //     let newMv = fn
    //     newMv.forEach(async (res) =>{
    //         await getMVRel(res.id).then(item=>{
    //             this.data.PreloadMv.push(item.data.data)
    //         }).catch(()=>{
    //             PreloadMv.push('undefined')
    //         })

    //     })
    // },
    // // 预加载视频参数
    // getMvParameter() {
    //     if (this.data.current >= 10) {
    //         let str = this.data.current - 10
    //         let end = this.data.current + 10
    //         let ParameterList = this.data.mvlist.slice(str,end)
    //         return ParameterList
    //     }else{
    //         let str = 0
    //         let end = this.data.current + 11
    //         let ParameterList = this.data.mvlist.slice(str,end)
    //         return ParameterList
    //     }
    // },
    // 滑块
    onSliderCon(){

    },
    bindchanging(res) {
        let that = this
        this.setVideoTime(res,that)
        this.setSliderStyle(res,that)
    },
    bindchange(res){
        this.data.clickSlider = true
        // 判断是否滑动

        const time = res.currentTarget.dataset.time
        // 1.获取点击的滑块位置对应的值
        const value = res.detail.value
        // 2.计算出要播放的时间
        const currentTime = value / 100 * time
        // 3.设置播放器，播放计算出的时间
        // audioContext.seek(currentTime / 1000)
        this.setData({videoTime:currentTime})
        
        this.data.sliderBom = false
        this.setVideoContext()
        setTimeout(() =>{
            this.data.clickSlider = false
        },2000)
        

    },
    setVideoContext(){
        console.log('快速滑动');
        // 操作视频
        if (this.data.getVideoBom) {
            let videoContext = wx.createVideoContext('video')
            console.log(this.data.videoTime);
            videoContext.seek(this.data.videoTime / 1000)
        }else {
            let query = wx.createSelectorQuery();
            query.select('#video').boundingClientRect(res =>{
                let videoContext = wx.createVideoContext('video')
                // 3.设置播放器，播放计算出的时间
                console.log(this.data.videoTime);
                videoContext.seek(this.data.videoTime / 1000)
                this.data.getVideoBom = true
            }).exec();
        }
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

        that.setData({videoMaxTime:currentTime})
        if (that.data.sliderb) {
            that.setData({
                sliderb:false
            })   
        }
        if (!that.data.clickSlider) {
            that.data.clickSlider = true
        }
    },500),

    // 全屏
    onFullScreen() {
        let query = wx.createSelectorQuery();
        query.select('#video').boundingClientRect(res =>{
            let videoContext = wx.createVideoContext('video')
            // 3.设置播放器，播放计算出的时间
            videoContext.requestFullScreen({direction:90})
            console.log('事件12');
        }).exec();
    }
})