// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({
    data:{
        songMenus:[]
    },
    onLoad() {
        this.fetchGetAllMenuList()
    },
    // 发送网络请求
    async fetchGetAllMenuList() {
        // 1.获取tags
        const res = await getSongMenuTag()
        const tags = res.data.tags
        // 2.根据tags去获取对应的歌单
        const allPromise = []
        for (const tag of tags) {
            // getSongMenuList 网络请求返回的是Promise
            const promise = getSongMenuList(tag.name)
            allPromise.push(promise)
        }
        // 3.获取所有的数据之后，调用一次setData
        Promise.all(allPromise).then(res => {
            this.setData({ songMenus: res.map(item=>{
                return item.data
            }) })
            console.log(this.data.songMenus);
        })
    }
})