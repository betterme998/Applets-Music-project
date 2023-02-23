// 使用第三方库完成 状态管理 
import { HYEventStore } from "hy-event-store"
import { getPlaylistDetail } from "../services/music"

const recommendStore = new HYEventStore({
    state: {
        recommendSongs:[]
    },
    actions: {
        // 发送网络请求
        fetchRecommendSongsAction(ctx) {
            getPlaylistDetail(3779629).then(res=>{
                ctx.recommendSongs = res.data.playlist.tracks
            })
        }
    }
})

export default recommendStore