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
        },
        onViewMore(){
            switch (this.properties.title) {
                case '综合':
                    this.triggerEvent("setTabItemActive",0)
                    break;
                case '单曲':
                    this.triggerEvent("setTabItemActive",1)
                    break;
                case '歌单':
                    this.triggerEvent("setTabItemActive",2)
                    break;  
                case '视频':
                    this.triggerEvent("setTabItemActive",3)
                    break;
                case '歌手':
                    this.triggerEvent("setTabItemActive",4)
                    break;
                case '用户':
                    this.triggerEvent("setTabItemActive",5)
                    break;   
            }
        }
    }
})
