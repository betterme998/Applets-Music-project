import { HYEventStore } from "hy-event-store" 


// 1.创建store
const playerStore = new HYEventStore({
    state:{
        playSongIndex:0,
        playSongList:[]
    }
})

export default playerStore