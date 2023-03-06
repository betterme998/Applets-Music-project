// pages/music-player/music-player.js
import { getSongDatail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import playerStore from "../../store/playerStore"
import { throttle } from 'underscore'

const app = getApp()
 // createInnerAudioContext 会创建音乐播放器 来播放歌曲
 const audioContext = wx.createInnerAudioContext()


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
        getlyric:true,

        playSongIndex:0,
        playSongList:[],
        isFirstPlay:true
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
         audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
          // 准备好之后自动播放
        audioContext.autoplay = true
 
         // 4.监听播放时间
         if (this.data.isFirstPlay) {
            this.data.isFirstPlay = false
            const throttleUpdataProgres = throttle(this.updateprogress,500, {leading:false,trailing:false})
            audioContext.onTimeUpdate((event) =>{
                // 1.更新歌曲进度
                if (!this.data.isSliderChanging && !this.data.isWaiting) {
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
    
                const currentLyricText= this.data.lyricInfos[index].text
                this.setData({
                    currentLyricText,
                    currentLyricIndex: index
                })   
    
                // 4.改变歌词滚动页面的位置
                if (this.data.getlyric) {
                    var query = wx.createSelectorQuery();
                    query.selectAll('.lyrictext').boundingClientRect(()=>{}).exec(res =>{
                        const lyricdom = res[0]
                        this.setData({lyricdom,getlyric:false})
                        console.log(res);
                    })
                }
                if (this.data.lyricdom.length>0&&index>=2) {
                    // console.log(this.data.lyricdom.length);
                    console.log(index);
                    if (index <= this.data.lyricdom.length) {
                        
                        const lyricScrolltop = this.data.lyricdom[index].top - this.data.lyricdom[index -1].top
                        this.setData({lyricScrolltop:lyricScrolltop+this.data.lyricScrolltop})
                    }
                    // console.log(this.data.lyricdom);
                }
            })
            audioContext.onWaiting(() => {
                // 监听是否等待，在等待就调用暂停
                audioContext.pause()
            })
            audioContext.onCanplay(()=>{
                // 监听是否可以播放，可以播放再播放
                audioContext.play()
            })
         }
    },
    // =============事件监听=============
    onSwiperChange(event) {
       this.setData({currentPage:event.detail.current})
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        this.setData({currentPage:index})
    },
    onSliderChange(event) {
        this.data.isWaiting = true
        setTimeout(()=>{
            this.data.isWaiting = false
        },1500)
        // 1.获取点击的滑块位置对应的值
        const value = event.detail.value
        // 2.计算出要播放的时间
        const currentTime = value / 100 * this.data.durationTime
        // 3.设置播放器，播放计算出的时间
        audioContext.seek(currentTime / 1000)
        this.setData({currentTime,isSliderChanging:false, sliderValue:value})
    },
    onSliderChanging(event) {
        // 1.获取滑块到的位置的value
        const value = event.detail.value
        // 2.根据当前的值，计算出对应的时间
        const currentTime = value / 100 * this.data.durationTime
        this.setData({ currentTime })

        // 3.当前再滑动
        this.data.isSliderChanging = true
    },
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
        this.changeNewSong(false)
    },
    onNextBtnTap(){
        this.changeNewSong()
    },

    changeNewSong(isNext = true) {
        // 下一首，1.找到之前索引
        const length = this.data.playSongList.length
        let index = this.data.playSongIndex

        // 计算最新索引
        index = isNext ? index + 1 : index - 1
        if (index === length) index = 0
        if (index === -1) index = length -1

        // 3.根据索引获取当前歌曲信息
        const newSong = this.data.playSongList[index]
        // 来回切换需要请求歌曲，会出现残影。所以清空之前的信息,数据回到初始状态
        this.setData({currentSong:{},sliderValue:0,currentTime:0,durationTime:0})
        // 开始播放新歌曲
        this.setupPlaySong(newSong.id)
        // 4.保存最新索引值
        playerStore.setState("playSongIndex",index)
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