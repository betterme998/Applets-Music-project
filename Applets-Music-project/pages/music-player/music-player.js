// pages/music-player/music-player.js
import { getSongDatail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import playerStore from "../../store/playerStore"
import { throttle } from 'underscore'

const app = getApp()
 // createInnerAudioContext 会创建音乐播放器 来播放歌曲
 const audioContext = wx.createInnerAudioContext()
 const modeNames = ["order", "repeat", "random"]


Page({
    data: {
        pageTitles:["歌曲","歌词"],
        currentPage:0,
        contentHeight:0,

        id:"",
        currentSong: {},
        lyricInfos:[],
        newline:[],
        currentLyricText:"",
        currentLyricIndex:0,

        durationTime:0,
        currentTime:0,
        sliderValue:0,
        isSliderChanging:false,
        isWaiting:false,
        isPlaying:true,

        lyricScrolltop:0,
        lyricdom:[],
        ldindex:[0,0],
        getlyric:true,

        playSongIndex:0,
        playSongList:[],
        isFirstPlay:true,

        playModeIndex: 0, //0：顺序播放 1：单曲循环 2：随机播放
        SingleCycle:false,//单曲循环
        playModeName:"order"
    },
    onLoad(options) {
        // 0.获取设备信息
        this.setData({
            contentHeight:app.globalData.contentHeight
        })

        // 1.获取传入的id
        const id = options.id
        // 2.根据id播放歌曲
        this.setupPlaySong(id)

        // 5.获取store共享数据
        playerStore.onStates(["playSongList","playSongIndex"],this.getPlaySonginfosHandler)
    },
    updateprogress(){
        // 1.记录当前的时间
        // 2.修改sliderValue 滑块的值
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({
            currentTime: audioContext.currentTime * 1000,
            sliderValue
        })
    },
    // ============播放歌曲==============
    setupPlaySong(id) {
        this.setData({id})
         // 2.请求歌曲相关数据    
         // 2.1根据id获取歌曲的详情
         getSongDatail(id).then(res => {
             this.setData({ 
                 currentSong:res.data.songs[0] ,
                 // 歌曲总时长
                 durationTime:res.data.songs[0].dt
             })
         })
 
         // 2.2.根据id获取歌词的信息
         getSongLyric(id).then(res => {
             const lrcString = res.data.lrc.lyric
             const lyricInfos = parseLyric(lrcString)
             const newline = parseLyric(lrcString,true)
             this.setData({ lyricInfos,newline})
         })
 
         // 3.播放当前的歌曲
         audioContext.stop()
         this.setData({currentSong:{},sliderValue:0,currentTime:0,durationTime:0,getlyric:true,ldindex: [0,0]})
         audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
          // 准备好之后自动播放
        audioContext.autoplay = true
         
         // 4.监听播放时间
         if (this.data.isFirstPlay) {
            this.data.isFirstPlay = false
            const throttleUpdataProgres = throttle(this.updateprogress,500, {leading:false,trailing:false})
            const ldindex = [0,0]
            audioContext.onTimeUpdate((event) =>{
                // 1.更新歌曲进度
                if (!this.data.isSliderChanging) {
                    throttleUpdataProgres()
                }
                // 2.匹配正确的歌词
                if (!this.data.lyricInfos.length) return
                let index = this.data.lyricInfos.length - 1

                for (let i = 0; i < this.data.lyricInfos.length; i++) {
                    const info = this.data.lyricInfos[i];
                    if(info.time >= audioContext.currentTime * 1000) {
                        index = i - 1
                        break
                    }
                }
                if (index === this.data.currentLyricIndex) return
    
                // 3.获取歌词的索引index和文本text
                const currentLyricText= this.data.lyricInfos[index]?.text
                // 4.获取歌词跳转起末索引index
                ldindex.push(index)
                if (ldindex.length > 2) ldindex.shift()
                if (ldindex[1] === 0 && ldindex[0] !== 0) {
                    this.setData({lyricScrolltop:0})
                }
                this.setData({
                    currentLyricText,
                    currentLyricIndex: index,
                    ldindex
                }) 

                
                
                // 4.自然改变歌词滚动页面的位置
                if (this.data.getlyric) {
                    var query = wx.createSelectorQuery();
                    query.selectAll('.lyrictext').boundingClientRect(()=>{}).exec(res =>{
                        const lyricdom = res[0]
                        this.setData({lyricdom,getlyric:false})
                    })
                }

                if (this.data.lyricdom.length>0&&this.data.currentLyricIndex>=2) {
                    if (this.data.currentLyricIndex <= this.data.lyricdom.length) {
                        
                        const lyricScrolltop = this.data.lyricdom[this.data.ldindex[1]].top - this.data.lyricdom[this.data.ldindex[0]].top
                        this.setData({lyricScrolltop:lyricScrolltop+this.data.lyricScrolltop})
                    }
                }
                // 4.1.通过滑块改变歌曲位置
            })
            audioContext.onWaiting(() => {
                // 监听是否等待，在等待就调用暂停
                audioContext.pause()
            })
            audioContext.onCanplay(()=>{
                // 监听是否可以播放，可以播放再播放
                audioContext.play()
            })
            // 监听自然播放结束
            audioContext.onEnded(() =>{
                ldindex.fill(0)
                this.setData({ldindex})
                this.changeNewSong()
            })
         }
    },
    // =============事件监听=============
    onNavBackTap(){
        wx.navigateBack()
    },
    onSwiperChange(event) {
       this.setData({currentPage:event.detail.current})
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        this.setData({currentPage:index})
    },
    onSliderChange(event) {
        // this.data.isWaiting = true
        // 1.获取点击的滑块位置对应的值
        const value = event.detail.value
        // 2.计算出要播放的时间
        const currentTime = value / 100 * this.data.durationTime
        // 3.设置播放器，播放计算出的时间
        audioContext.seek(currentTime / 1000)
        this.setData({currentTime,isSliderChanging:false, sliderValue:value})

        // 4.判断是否使用滑块
    },
    //节流
    onSliderChanging:throttle(function(event){
        // 1.获取滑块到的位置的value
        const value = event.detail.value
        // 2.根据当前的值，计算出对应的时间
        const currentTime = value / 100 * this.data.durationTime
        this.setData({ currentTime })

        // 3.当前再滑动
        this.data.isSliderChanging = true
        setTimeout(()=>{
            this.data.isSliderChanging = false
        },1000)
    },100),
    // onSliderChanging(event) {
        
    // },
    onPlayOrPauseTap() {
        if (!audioContext.paused) {
            audioContext.pause()
            this.setData({isPlaying:false})
        }else{
            audioContext.play()
            this.setData({isPlaying:true})
        }
    },
    onPrevBtnTap(){
        this.setData({SingleCycle:true})
        this.changeNewSong(false)
    },
    onNextBtnTap(){
        this.setData({SingleCycle:true})
        this.changeNewSong()
    },
    changeNewSong(isNext = true) {
        // 下一首，1.找到之前索引
        const length = this.data?.playSongList.length
        let index = this.data?.playSongIndex
        function random(){
            let indexNew = Math.floor(Math.random() * length)
            if (indexNew !== index){index = indexNew}else{random()} 
        }


        // 计算最新索引
        switch(this.data.playModeIndex) {
            case 1: //单曲循环
            case 0: //顺序播放
                index = isNext ? index + 1 : index - 1
                if (index === length) index = 0
                if (index === -1) index = length -1
                break
            case 2: //随机播放
                random()
                break
        }

        // 3.根据索引获取当前歌曲信息
        const newSong = this.data.playSongList[index]
        // 来回切换需要请求歌曲，会出现残影。所以清空之前的信息,数据回到初始状态
        this.setData({currentSong:{},sliderValue:0,currentTime:0,durationTime:0,lyricScrolltop:0,getlyric:true})
        // 开始播放新歌曲
        this.setupPlaySong(newSong.id)
        // 4.保存最新索引值
        playerStore.setState("playSongIndex",index)
        this.setData({SingleCycle:false})
    },

    onModeBtnTap(){
        let modeIndex = this.data.playModeIndex
        modeIndex = modeIndex + 1
        if (modeIndex === 1) {
            audioContext.loop = true
        }else{
            audioContext.loop = false
        }
        if (modeIndex === 3) modeIndex = 0
        this.setData({playModeIndex:modeIndex,playModeName:modeNames[modeIndex]})
    },


    // ==================store共享数据================
    getPlaySonginfosHandler({playSongList,playSongIndex}) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
    },
    onUnload() {
        playerStore.offStates(["playSongList","playSongIndex"],this.getPlaySonginfosHandler)
    }
})