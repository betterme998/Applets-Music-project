import {hyRequest} from "./index"

// 搜索建议，必选参数keywords， 可选产生mobile 返回移动端数据
export function searchPropose(keywords,type="mobile") {
    return hyRequest.get({
        url:"/search/suggest",
        data:{
            keywords,
            type
        }
    })
}

// 搜索结果
export function search(keywords,limit=5,type=1,offset=0) {
    return hyRequest.get({
        url:"/cloudsearch",
        data:{
            keywords,
            limit,
            type,
            offset
        }
    })
}


export function searchRecommend() {
    return hyRequest.get({
        url:"/search/hot"
    })
}