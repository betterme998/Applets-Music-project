// components/search-result-item/search-result-item.js
import playerStore from "../../store/playerStore"
Component({
    // 多个插槽要加上这个
    options:{
        multipleSlots:true
    },
    properties: {
        title:{
            type:String,
            value:''
        },
        singleList:{
            type:Array,
            value:[]
        },
        keyWorld:{
            type:String,
            value:''
        }
    },
    data: {

    },
    methods: {
        onSingleItem(event) {
            let index = event.currentTarget.dataset.index
            // 1.拿到播放列表. 放到store的第三方库中
            playerStore.setState("playSongList",this.properties.singleList)
            playerStore.setState("playSongIndex",index)
        }
    }
})
