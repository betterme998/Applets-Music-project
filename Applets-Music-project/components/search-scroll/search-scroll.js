// components/search-scroll/search-scroll.js
Component({
    // 多个插槽要加上这个
    options:{
        multipleSlots:true
    },
    properties: {
        tabsValue:{
            type:Array,
            value:[]
        },
        resultHeight:{
            type:Number,
            value:0
        }
    },
    data: {
    },
    lifetimes: {
        attached: function() {
             
        }
    },
    methods: {
        vanTabClick(event) {
            let index = event.detail.index
            this.triggerEvent("getTabItemValue",index)
        },
        bindscrolltolower(event){
            let name = event.currentTarget.dataset.name
            this.triggerEvent('onscrolltolowerb',name)
        }
    }
})
