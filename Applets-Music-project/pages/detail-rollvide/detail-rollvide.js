// pages/detail-rollvide/detail-rollvide.js
import { getMVRel,getTopMVL,getMVInfo } from "../../services/video"
import { search } from "../../services/search"
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
        bodyHeight:0,
        bodyWidth:0,
        sliderConHeight:0,
        isPlaying:true,
        newMvList:[],
        swiperPullBom:true,
        mvCount:0,
        startIndex:0,
        startSlice:true,
        storeCurrent:[],
        getMVTime:'',
        Full:false,
        scliderTimeout:'',
        FullCurrentTime:0
    },
    async onLoad(options) {
        // 设置视频高度
        let that = this
        let videoHeight = app.globalData.screeWidth / 1.777
        let bottomHeight = app.globalData.tabbarHeight
        let bodyHeight = app.globalData.screeHeight - app.globalData.tabbarHeight
        let bodyWidth = app.globalData.screeWidth
        // 处理传过来的数据
        let a = decodeURIComponent(options.mvlist)
        let mvlist = JSON.parse(a)
        this.setMvListData(mvlist,0)
        this.data.mvlist = mvlist
        // 计算裁剪后的10个mv数据及当前播放
        let index = options.index
        let mvCount = options.mvCount
        this.data.mvCount = mvCount
        // let newIndex = Number(index) - (Math.floor(Number(index) / 10) * 10)
        // let multiple = Math.ceil(Number(index) / 10) * 10
        // let newMvList = mvlist.slice(multiple===0 ? 0:multiple-10,multiple===0 ? multiple+10:multiple)

        let newMvList = mvlist.slice(index>=3 ? index-3:0,index+4)
        let newIndex = index >= 3 ? 3:Number(index)
        this.data.storeCurrent.push(newIndex)
        this.data.startIndex = Number(index)
        let id = options.id
        let key = options.keyworld
        this.setData({
            newMvList,
            id,
            index:newIndex,
            current:newIndex,
            key,
            videoHeight,
            bodyWidth,
            bottomHeight,
            bodyHeight
        })
        this.data.getMVTime = new Date().getTime();
        this.getMv(that,this.data.getMVTime)
        this.getSliderCon()
        // this.getPreloadMv(this.getMvParameter())
        await this.getMVInfoFn(id,that,this.data.getMVTime)
        this.getRollHeight()
    },
    onShow() {

    },
    onUnload() {
        clearInterval(this.rollLoop)
    },
    // 处理数据
    setMvListData(mvlist,start){
        let newStart = start * 10
        let minList = mvlist.slice(newStart,newStart+10)
    },
    // 轮播下拉获取mv数据
    async swiperPullDown(){
        //视频上拉下拉
        if (this.data.swiperPullBom) {
            this.data.swiperPullBom = false
            await search(this.data.key,10,1004,this.data.mvlist.length).then(res => {
                let newMvData = res.data.result.mvs
                let mvData = this.data.mvlist
                mvData.push(...newMvData)
                this.data.mvlist = mvData
                this.data.swiperPullBom = true
            })   
        }
    },
    onNavBackTap(){
        app.globalData.HomeFocus = false
        wx.navigateBack()
    },
    bindchangeSwiper(event){
        let current = event.detail.current
        this.data.storeCurrent.push(current)   
        if (this.data.storeCurrent.length>2) {
            this.data.storeCurrent.shift()
        }
        if (this.data.startSlice) {
            this.data.startIndex = this.data.startIndex + (this.data.storeCurrent[1] - this.data.storeCurrent[0])
        }
        this.data.startSlice = true
        this.setData({current})
        if (this.data.mvlist.length !== Number(this.data.mvCount) &&this.data.startIndex === this.data.mvlist.length - 3) {
            this.swiperPullDown()
        }
        if ((current === this.data.newMvList.length - 1 && this.data.startIndex !== this.data.mvlist.length - 1)|| (current === 0 && this.data.startIndex !==0)) {
            let mvlist = this.data.mvlist
            let startIndex = this.data.startIndex
            let start = startIndex -3
            let end = startIndex +4
            let newMvList = mvlist.slice(start>0 ? start:0, end)
            this.setData({
                newMvList,
                index:this.data.startIndex>3 ? 3:this.data.startIndex,
                current:this.data.startIndex>3 ? 3:this.data.startIndex,
            })
            this.data.storeCurrent = []
            this.data.startSlice = false
        }

        console.log(current,this.data.startIndex,this.data.storeCurrent,this.data.newMvList);
        let that = this
        this.data.clickSlider = false
        this.data.getVideoBom = false
        this.setData({mvInfo:{},iconText:true,speedtime:0,rollLoopBom:false,descHeight:0,animationName:'',sliderb:true})
        this.setData({
            mvComplete:false,
            imageShow:true,
            videoPlay:{},
            videoTime:0,
            videoMaxTime:0,
            sliderValue:0,
            id:this.data.newMvList[this.data.current].id
        })
        this.data.getMVTime = new Date().getTime();
        this.getMv(that,this.data.getMVTime)
        // 获取mv详情
        this.getMVInfoFn(this.data.id,that,this.data.getMVTime)
    },
    onImageClick(){
        let query = wx.createSelectorQuery();
        if (this.data.iconText) {
            if (this.data.PauseBom) {
                query.select('#video').boundingClientRect(res =>{
                    this.videoContext = wx.createVideoContext('video')
                    // 3.设置播放器，播放计算出的时间
                    this.videoContext.play()
                    this.setData({
                        PauseBom:false,
                        isPlaying:true
                    })   
                }).exec();
    
            }else{
                query.select('#video').boundingClientRect(res =>{
                    this.videoContext = wx.createVideoContext('video')
                    // 3.设置播放器，播放计算出的时间
                    this.videoContext.pause()
                    this.setData({
                        PauseBom:true,
                        isPlaying:false
                    })   
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
            this.videoContext = wx.createVideoContext('video')
            // 3.设置播放器，播放计算出的时间
            this.videoContext.play()
            this.setData({
                PauseBom:false,
                isPlaying:true
            })   
        }).exec();
    },
    getImageInfo(event){
        let query = wx.createSelectorQuery();
        query.select('#video').boundingClientRect(res =>{
            
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
        if (!that.data.clickSlider){
            that.setData({
                sliderValue:sliderTime
            }) 
        }
        if (that.data.Full) {
            that.setData({
                FullCurrentTime:event.detail.currentTime
            })
        }
    },2000),
    setSliderTimeFn(event){
        let that = this
        this.onBindtimeupdate(event,that)
    },
    bindloadedmetadata(event) {
        let videoHeightItem = (event.detail.height / event.detail.width) * app.globalData.screeWidth
        let videoFullWidth = app.globalData.screeWidth/(event.detail.height / event.detail.width)
        this.setData({
            videoHeightItem,
            videoFullWidth,
            imageShow:false
        })
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
    getMv:debounce((that,time)=>{
        getMVRel(that.data.id).then(res =>{
            if (res.data.data.url && time === that.data.getMVTime) {
                that.setData({
                    mvComplete:true,
                    videoPlay:res.data.data
                })
            }  
        })
        // this.setData({mvInfos: res.data.playlist})
    },500,true),
    getMVInfoFn:debounce((id,that,time) => {
        getMVInfo(id).then(res =>{
            if (time === that.data.getMVTime) {
                let mvInfo = res.data.data
                that.setData({
                    mvInfo
                })
                that.getRollNameHeight()   
            }
            // this.setRollStop()
        })
    },500,true),

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
        // this.setData({videoTime:currentTime})
        this.data.videoTime = currentTime
        
        this.data.sliderBom = false
        this.setVideoContext()
        if (this.data.scliderTimeout){
            console.log('hahah');
            clearTimeout(this.data.scliderTimeout)
        } 
        this.data.scliderTimeout = setTimeout(() =>{
            this.data.clickSlider = false
            console.log('延迟打印');
        },2000)
    },
    setVideoContext(){
        // 操作视频
        if (this.data.getVideoBom) {
            this.videoContext = wx.createVideoContext('video')
            this.videoContext.seek(this.data.videoTime / 1000)
        }else {
            let query = wx.createSelectorQuery();
            query.select('#video').boundingClientRect(res =>{
                this.videoContext = wx.createVideoContext('video')
                // 3.设置播放器，播放计算出的时间
                this.videoContext.seek(this.data.videoTime / 1000)
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
            this.videoContext = wx.createVideoContext('video')
            // 3.设置播放器，播放计算出的时间
            this.videoContext.requestFullScreen()
        }).exec();
    },
    bindfullscreenchange(event) {
        console.log(event);
        let fullScreen = event.detail.fullScreen
        if(fullScreen){
            this.setData({
                Full:true
            })
        }else{
            this.setData({
                Full:false
            })
        }
    }
})