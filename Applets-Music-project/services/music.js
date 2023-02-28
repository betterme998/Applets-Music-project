// 首页音乐网络请求
import { hyRequest } from "./index"

// 调用此接口 , 可获取 banner( 轮播图 ) 数据
export function getMusicBanner(type = 0) {
    return hyRequest.get({
        url:"/banner",
        data:{
            type
        }
    })
}

// 调用此接口 , 传入榜单 id, 可获取不同排行榜数据
export function getPlaylistDetail(id) {
    return hyRequest.get({
        url:"/playlist/detail",
        data:{
            id
        }
    })
}

// 调用此接口 , 可获取网友精选碟歌单
export function getSongMenuList(cat="全部", limit = 6, offset = 0) {
    return hyRequest.get({
        url:"/top/playlist",
        data:{
            cat,
            limit,
            offset
        }
    })
}

// 调用此接口,可获取歌单分类,包含 category 信息
export function getSongMenuTag() {
    return hyRequest.get({
        url:"/playlist/hot"
    })
}