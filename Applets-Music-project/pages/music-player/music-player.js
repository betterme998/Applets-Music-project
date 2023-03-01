// pages/music-player/music-player.js
import { getSongDatail, getSongLyric } from "../../services/player"

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
        lrcString:{},

        durationTime:0,
        currentTime:0
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
            this.setData({ currentSong:res.data.songs[0] })
        })

        // 2.2.根据id获取歌词的信息
        getSongLyric(id).then(res => {
            this.setData({ lrcString: res.data.lrc })
        })

        // 3.播放当前的歌曲
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // 准备好之后自动播放
        audioContext.autoplay = true

        // 4.监听播放时间
        audioContext.onTimeUpdate((event) =>{
            // 1.记录当前的时间
            this.setData({currentTime: audioContext.currentTime})
            // console.log("1",audioContext.currentTime);
        })
    },

    // =============事件监听=============
    onSwiperChange(event) {
       this.setData({currentPage:event.detail.current})
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        this.setData({currentPage:index})
    }
})