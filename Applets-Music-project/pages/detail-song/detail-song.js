// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore, { rankingsIds } from "../../store/rankingStore"
import { getPlaylistDetail } from "../../services/music"
import playerStore from "../../store/playerStore"
const app = getApp()
Page({
    data: {
        type:"ranking",
        key:"newRanking",
        id:"",
        bgColor:[],
        songInfos: {},
        homeTop:0,
        bodyHeight:0,
        nextMargin:0,
        triggered:false,
        headerHeight:225,
        scrollTop:0
    },
    onLoad(options) {
        // 1.确定获取数据的类型
        // type:ranking ->榜单数据
        // type:recommend -> 推荐数据
        const type = options.type
        this.setData({type})

        // 获取store中榜单数据
        if (type === "ranking") {
            // 巅峰
            const key = options.key
            this.data.key = key
            rankingStore.onState(key,this.handleRanking)
        }else if (type === "recommend") {
            // 推荐歌曲
            recommendStore.onState("recommendSongInfo", this.handleRanking)
        }else if (type === "menu") {
            const id = options.id
            this.data.id = id
            this.fetchMenuSongInfo()
        }

        // 获取高度
        this.getNavTabHeight()
    },

    async fetchMenuSongInfo() {
        const res =  await getPlaylistDetail(this.data.id)
        this.setData({songInfos: res.data.playlist})
    },
    // ==============事件监听============
    onSongItemTap(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.songInfos.tracks)
        playerStore.setState("playSongIndex", index)

    },
    onBgColor(event) {
        let bgColor = event.detail
        this.setData({
            bgColor
        }),
        this.getHeaderHeight()
    },
    onNavBackTap(){
        wx.navigateBack()
    },
    bindrefresherrefresh(){
        this.setData({
            triggered:false
        })
    },
    binddragend(event) {
        let scrollTop = event.detail.scrollTop
        if (scrollTop < 60) {
            this.setData({
                scrollTop:0
            })
        }else if (scrollTop<this.data.headerHeight) {
            this.setData({
                scrollTop:this.data.headerHeight
            })
        }
    },
    // 获取nav+tab高度
    getNavTabHeight() {
        let query = wx.createSelectorQuery();
        query.select('.navCon').boundingClientRect(res =>{
            let homeTop = res?.height
            let bodyHeight = app.globalData.screeHeight - homeTop
            const dpr = wx.getWindowInfo().pixelRatio
            let nextMargin = bodyHeight*dpr - 450
            this.setData({
                homeTop:homeTop,
                bodyHeight:bodyHeight*dpr,
                nextMargin:nextMargin
            })
            
        }).exec();
        
    },
    // 获取header高度
    getHeaderHeight() {
        let query = wx.createSelectorQuery();
        wx.nextTick(()=>{
            query.select('#header').boundingClientRect(res =>{
                let headerHeight = res?.height
                this.setData({
                    headerHeight
                })
            }).exec();
        })
    },

    // ==============store共享数据=============

    handleRanking(value) {
        if (this.data.type === "recommend") {
            value.name = "推荐歌曲"
        }
        this.setData({songInfos:value})
        wx.setNavigationBarTitle({
          title: value.name,
        })
    },
    onUnload() {
        if (this.data.type === "ranking") {
            rankingStore.offState(this.data.key, this.handleRanking)
        }else if (this.data.type === "recommend") {
            recommendStore.offState("recommendSongInfo", this.handleRanking)
        }
    }
})