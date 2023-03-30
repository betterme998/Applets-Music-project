// components/prompt-list/prompt-list.js
Component({
    properties: {
        loading:{
            type:Boolean,
            value:false
        },
        ProposeListValue:{
            type:Array,
            value:[]
        },
        values:{
            type:String,
            value:''
        },
        nolistShow:{
            type:Boolean,
            value:false
        }
    },
    data: {
        listindex:''
    },
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            
        }
    },
    methods: {
        onSearchBtnWord(event) {
            let keyworld = event.currentTarget.dataset
            this.triggerEvent('srarchitemevent', keyworld,)
        }
    }
})
