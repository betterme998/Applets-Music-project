// components/area-header/area-header.js
Component({
    properties: {
        title: {
            type: String,
            value:"默认标题"
        },
        hasMore: {
            type:Boolean,
            value:true
        }
    },
    methods: {
        onMoreTap() {
            // 发送自定义事件
            this.triggerEvent("moreclick")
        }
    }
})
