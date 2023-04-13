// pages/music-player/music-player.js
import { getSongDatail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import playerStore, {audioContext} from "../../store/playerStore"
import { throttle } from 'underscore'

const app = getApp()
 // createInnerAudioContext 会创建音乐播放器 来播放歌曲
 const modeNames = ["icon-xunhuanbofang", "icon-danquxunhuan", "icon-suijibofang"]


Page({
    data: {
        id:"",
        stateKeys:["id", "currentSong", "durationTime", "currentTime", "lyricInfos","ldindex","currentLyricText", "currentLyricIndex","sliderValue","lyricdom","isPlaying","playModeIndex"],
        currentSong: {},
        lyricInfos:[],
        currentLyricText:"",
        currentLyricIndex:0,

        durationTime:0,
        currentTime:0,
        sliderValue:0,

        lyricScrolltop:0,
        lyricdom:[],
        ldindex:[0,0],
        getlyric:true,

        playSongIndex:0,
        playSongList:[],
        isFirstPlay:true,
        isPlaying:false,

        playModeIndex: 0, //0：顺序播放 1：单曲循环 2：随机播放
        playModeName:"icon-xunhuanbofang",
        pageTitles:["歌曲","歌词"],
        currentPage:0,
        contentHeight:0,
        isSliderChanging:false,
        topBool:false,

        show: false
    },
    onLoad(options) {
        // 0.获取设备信息
        this.setData({
            contentHeight:app.globalData.contentHeight,
            show:app.globalData.show
        })
        // 1.获取传入的id
        const id = options.id
        const topBool = options.topBool
        if (topBool) {
            this.setData({topBool})
        }

        // 2.根据id播放歌曲
        if(id) {
            playerStore.dispatch("playMusicWithSongId", id)
        }
        // 5.获取store共享数据
        playerStore.onStates(["playSongList","playSongIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(this.data.stateKeys,this.getPlayerInfosHandler)
    },
    updateprogress:throttle(function(currentTime){
        // 1.记录当前的时间
        // 2.修改sliderValue 滑块的值
        if (!this.data.isSliderChanging) {
            const sliderValue = currentTime / this.data.durationTime * 100
            this.setData({currentTime,sliderValue}) 
        } 
    },800,{leading:false,trailing:false}),
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
        this.setData({currentTime, sliderValue:value,isSliderChanging: false})

        // 4.判断是否使用滑块
    },
    showPopup(){
        // 音乐列表显示
        this.setData({ show: true });
    },
    //节流
    onSliderChanging:throttle(function(event){
        if (this.data.isSliderChanging) return
        // 1.获取滑块到的位置的value
        const value = event.detail.value
        // 2.根据当前的值，计算出对应的时间
        const currentTime = value / 100 * this.data.durationTime
        this.setData({ currentTime,isSliderChanging: true })
    },100),
    onPlayOrPauseTap() {
        // 播放暂停
       playerStore.dispatch("playMusicStatusAction")
    },
    onPrevBtnTap(){
        playerStore.dispatch("playNewMusicAction", false)
    },
    onNextBtnTap(){
        playerStore.dispatch("playNewMusicAction", true)
    },
    onModeBtnTap(){
        playerStore.dispatch("changPlayModeAcyion")
    },
    onchaShowFn(){
        this.setData({show:false})
    },

    // ==================store共享数据================
    getPlaySonginfosHandler({playSongList,playSongIndex}) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            console.log(playSongIndex);
            this.setData({ playSongIndex })
        }
    },
    getPlayerInfosHandler({
        id,currentSong,durationTime, currentTime, lyricInfos,ldindex,currentLyricText, currentLyricIndex,sliderValue,lyricdom,isPlaying,playModeIndex
    }) {
        if (id !== undefined) {
            this.setData({id})
        }
        if (currentSong) {
            this.setData({currentSong})
        }
        if (currentLyricText) {
            this.setData({currentLyricText})
        }
        if (currentLyricIndex) {
            // 匹配的歌词index，歌词滑动距离
            this.setData({currentLyricIndex})
            // 歌词滚动
            if (this.data.ldindex[1] === 1 && this.data.ldindex[0] === 0) {
                this.setData({lyricScrolltop:0})
            }
            if (this.data.topBool&&this.data.lyricdom.length) {
                // 播放栏进入，重新计算歌词位置
                const lyricScrolltop = this.data?.lyricdom[this.data.currentLyricIndex]?.top - this.data?.lyricdom[2]?.top
                this.setData({lyricScrolltop:lyricScrolltop,topBool:false})
            }
            // 4.自然改变歌词滚动页面的位置
            if (this.data.lyricdom.length>0&&this.data.currentLyricIndex>=2&&this.data.ldindex[1] !== this.data.ldindex[0]) {
               if (this.data.currentLyricIndex <= this.data.lyricdom.length) {
                   const lyricScrolltop = this.data.lyricdom[this.data.ldindex[1]].top - this.data.lyricdom[this.data.ldindex[0]].top
                   this.setData({lyricScrolltop:lyricScrolltop+this.data.lyricScrolltop})
               }
           }
        }
        if (ldindex) {
            this.setData({ldindex})
        }
        if (lyricdom) {
            this.setData({lyricdom})
        }
        if (sliderValue) {
            this.setData({sliderValue})
        }
        if (lyricInfos) {
            this.setData({lyricInfos})
        }
        if (durationTime !== undefined) {
            this.setData({durationTime})
        }
        if (currentTime !== undefined) {
            // 根据当前时间改变当前进度
            this.updateprogress(currentTime)
        }
        if (isPlaying !== undefined) {
            // 根据当前时间改变当前进度
            this.setData({isPlaying})
        }
        if (playModeIndex !== undefined) {
            // 根据当前时间改变当前进度
            this.setData({playModeIndex,playModeName:modeNames[playModeIndex]})
        }
    },
    onUnload() {
        playerStore.offStates(["playSongList","playSongIndex"],this.getPlaySonginfosHandler)
        playerStore.offStates(this.data.stateKeys,this.getPlayerInfosHandler)
    }
})