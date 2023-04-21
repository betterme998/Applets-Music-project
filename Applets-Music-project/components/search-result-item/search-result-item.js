// components/search-result-item/search-result-item.js
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
        }
    },
    data: {

    },
    methods: {

    }
})
