import { mapRequest } from "./index"

export function getCity(key='wx95c8f252893fc296',keyword) {
    return mapRequest.get({
        url:'/search',
        data:{
            key,
            keyword
        }
    })
}