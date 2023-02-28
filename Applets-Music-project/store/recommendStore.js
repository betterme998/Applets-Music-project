// 使用第三方库完成 状态管理 
import { HYEventStore } from "hy-event-store"
import { getPlaylistDetail } from "../services/music"

const recommendStore = new HYEventStore({
    state: {
        recommendSongInfo:{}
    },
    actions: {
        // 发送网络请求
        fetchRecommendSongsAction(ctx) {
            getPlaylistDetail(3778678).then(res=>{
                ctx.recommendSongInfo = res.data.playlist
            })
        }
    }
})

export default recommendStore