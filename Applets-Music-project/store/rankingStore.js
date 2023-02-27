import { HYEventStore } from "hy-event-store"
import { getPlaylistDetail } from "../services/music"

const rankingsIds = [3779629,2884035,19723756]
const rankingStore = new HYEventStore({
    state:{
        newRanking:{},
        originRanking:{},
        upRanking:{}
    },
    actions: {
        fetchRankingDataAction(ctx) {
            for(const id of rankingsIds) {
                getPlaylistDetail(id).then(res =>{
                    console.log(res);
                })
            }
        }
    }
})

export default rankingStore