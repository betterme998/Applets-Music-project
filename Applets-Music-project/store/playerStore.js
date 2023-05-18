import { HYEventStore } from "hy-event-store" 
import { getSongLyric, getSongDatail} from "../services/player"
import { parseLyric } from "../utils/parse-lyric"

export const audioContext = wx.createInnerAudioContext()
const app = getApp()
const modeNames = ["icon-xunhuanbofang", "icon-danquxunhuan", "icon-suijibofang"]
audioContext.onError(res => {
    console.log(res);
})


// 1.创建store
const playerStore = new HYEventStore({
    state:{
        playSongIndex:0,
        playSongList:[],

        id:"",
        currentSong: {},
        lyricInfos:[],
        currentLyricText:"",
        currentLyricIndex:0,
        durationTime:0,
        currentTime:0,
        sliderValue:0,
        ldindex:[0,0],
        lyricdom:[],
        isFirstPlay:true,
        getlyric:true,

        isPlaying:false,
        playModeIndex:0, //0：顺序播放 1：单曲循环 2：随机播放
        playModeNames:'icon-xunhuanbofang'
    },
    actions:{
        async playMusicWithSongId(ctx,id) {
            // 0.原来的数据重置
            audioContext.stop()
            // ctx.currentSong = {}
            ctx.sliderValue = 0
            ctx.currentTime = 0
            // ctx.durationTime = 0
            ctx.getlyric = true
            ctx.ldindex = [0,0]
            // 1.保存id
            ctx.id = id
            ctx.isPlaying = true
            // 2.请求歌曲相关数据    
            // 2.1根据id获取歌曲的详情
            getSongDatail(ctx.id).then(res => {
                ctx.currentSong = res.data.songs[0]
                ctx.durationTime = res.data.songs[0].dt
            })
    
            // 2.2.根据id获取歌词的信息
            await getSongLyric(ctx.id).then(res => {
                const lrcString = res.data.lrc.lyric
                const lyricInfos = parseLyric(lrcString)
                ctx.lyricInfos = lyricInfos

                 // 3.播放当前的歌曲
                audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                // 准备好之后自动播放
                audioContext.autoplay = true
                // audioContext.play()
            })
    
           
            
            // 4.监听播放时间
            if (ctx.isFirstPlay) {
                // ctx.isFirstPlay = false
                const ldindex = [0,0]
                audioContext.onCanplay(()=>{
                    // audioContext.pause()
                    // 监听是否可以播放，可以播放再播放
                    audioContext.autoplay = true

                })
                audioContext.onTimeUpdate((event) =>{
                    // 1.获取当前播放的时间
                    ctx.currentTime = audioContext.currentTime * 1000
                    // 2.获取歌词节点
                    if (ctx.getlyric) {
                        var query = wx.createSelectorQuery();
                        query.selectAll('.lyrictext').boundingClientRect(()=>{}).exec(res =>{
                            const lyricdom = res[0]
                            ctx.lyricdom = lyricdom
                            ctx.getlyric = false
                        })
                    }

                    // 3.匹配正确的歌词
                    if (!ctx.lyricInfos.length) return
                    let index = ctx.lyricInfos.length - 1

                    for (let i = 0; i < ctx.lyricInfos.length; i++) {
                        const info = ctx.lyricInfos[i];
                        if(info.time > audioContext.currentTime * 1000) {
                            index = i - 1
                            break
                        }
                    }
                    if (index === ctx.currentLyricIndex) return
        
                    // 4.获取歌词的索引index和文本text
                    const currentLyricText= ctx.lyricInfos[index]?.text
                    // 5.获取歌词跳转起末索引index
                    ldindex.push(index)
                    if (ldindex.length > 2) ldindex.shift()
                    
                    
                    ctx.currentLyricText = currentLyricText
                    ctx.currentLyricIndex = index
                    ctx.ldindex = ldindex
                    // console.log(ctx.currentLyricIndex);
                    
                    // 4.1.通过滑块改变歌曲位置
                })
                audioContext.onWaiting(() => {
                    // 监听是否等待，在等待就调用暂停
                    // audioContext.pause()
                })
                // 监听自然播放结束
                audioContext.onEnded(() =>{
                    ldindex.fill(0)
                    ctx.ldindex = ldindex


                    if (audioContext.loop) return
                    // 切换歌曲
                    this.dispatch("playNewMusicAction")
                })
            }
        },
        playMusicStatusAction(ctx) {
            // 暂停-播放
            if (ctx.isPlaying) {
                audioContext.pause()
                ctx.isPlaying = false
            }else{
                audioContext.play()
                ctx.isPlaying = true
            }
        },
        changPlayModeAcyion(ctx) {
            // 播放模式
            let modeIndex = ctx.playModeIndex
            modeIndex = modeIndex + 1
            if (modeIndex === 1) {
                audioContext.loop = true
            }else{
                audioContext.loop = false
            }
            if (modeIndex === 3) modeIndex = 0
            // 2.保存当前模式
            ctx.playModeIndex = modeIndex
            ctx.playModeNames = modeNames[modeIndex]
        },
        playNewMusicAction(ctx,isNext = true) {
            // 上一首。下一首
            // 下一首，1.找到之前索引
            const length = ctx.playSongList.length
            let index = ctx.playSongIndex
            function random(){
                let indexNew = Math.floor(Math.random() * length)
                if (indexNew !== index){index = indexNew}else{random()} 
            }
            // 计算最新索引
            switch(ctx.playModeIndex) {
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
            const newSong = ctx.playSongList[index]
            
            // 开始播放新歌曲
            if (newSong.id !== undefined) {
                this.dispatch("playMusicWithSongId",newSong.id)
            }
            // 4.保存最新索引值
            ctx.playSongIndex = index
            app.globalData.playSongIndex = index
        }
    }
})

export default playerStore