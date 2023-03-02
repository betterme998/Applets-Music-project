// pages/music-player/music-player.js
import { getSongDatail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import { throttle } from 'underscore'

const app = getApp()
 // createInnerAudioContext 会创建音乐播放器 来播放歌曲
 const audioContext = wx.createInnerAudioContext()
 // 准备好之后自动播放
 audioContext.autoplay = true

Page({
    data: {
        pageTitles:["歌曲","歌词"],
        currentPage:0,
        contentHeight:0,

        id:"",
        currentSong: {},
        lyricInfos:[],
        currentLyricText:"",
        currentLyricIndex:0,

        durationTime:0,
        currentTime:0,
        sliderValue:0,
        isSliderChanging:false,
        isWaiting:false,
        isPlaying:true
    },
    onLoad(options) {
        // 0.获取设备信息
        this.setData({
            contentHeight:app.globalData.contentHeight
        })

        // 1.获取传入的id
        const id = options.id
        this.data.id = id

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
            this.setData({ lyricInfos})
        })

        // 3.播放当前的歌曲
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

        // 4.监听播放时间
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
                if(info.time > audioContext.currentTime * 1000) {
                    index = i - 1
                    break
                }
            }
            if (index === this.data.currentLyricIndex) return
            const currentLyricText= this.data.lyricInfos[index].text
            this.setData({currentLyricText,currentLyricIndex: index})   
        })
        audioContext.onWaiting(() => {
            // 监听是否等待，在等待就调用暂停
            audioContext.pause()
        })
        audioContext.onCanplay(()=>{
            // 监听是否可以播放，可以播放再播放
            audioContext.play()
        })
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
    }
})