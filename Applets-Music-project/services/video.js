import {hyRequest} from "./index"

// 请求mv数据，参数传进来，配置默认参数，方便管理
export function getTopMVL(offset = 0,limit = 20) {
    return hyRequest.get({
        url: "/top/mv",
        data:{
            limit,
            offset
        }
    })
}

// 请求mv视频数据
export function getMVRel(id) {
    return hyRequest.get({
        url:"/mv/url",
        data:{
            id
        }
    })
}

// 请求mv详细信息
export function getMVInfo(mvid) {
    return hyRequest.get({
        url:"/mv/detail",
        data:{
            mvid
        }
    })
}