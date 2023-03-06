// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore, { rankingsIds } from "../../store/rankingStore"
import { getPlaylistDetail } from "../../services/music"
import playerStore from "../../store/playerStore"

Page({
    data: {
        type:"ranking",
        key:"newRanking",
        id:"",

        songInfos: {}
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
    },

    async fetchMenuSongInfo() {
        const res =  await getPlaylistDetail(this.data.id)
        this.setData({songInfos: res.data.playlist})
        console.log(res);
    },
    // ==============事件监听============
    onSongItemTap(event){
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.songInfos.tracks)
        playerStore.setState("playSongIndex", index)

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