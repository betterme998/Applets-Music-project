// components/speciallyClick/spec-click-click.js
Component({
    properties: {
        deepen:{
            // 加深点击样式
            type:Boolean,
            value:false
        }
    },
    data: {
        leftx:0,
        topy:0,
        show:false
    },
    methods: {
        // 事件监听
        onclickCartoon(event) {
            this.createSelectorQuery().selectAll('.container').boundingClientRect((rect) => {
                let y = event.changedTouches[0].clientY - rect[0].top;
                let x = event.changedTouches[0].clientX - event.currentTarget.offsetLeft;
                this.setData({
                    leftx:x,
                    topy:y,
                    show:true
                })
                setTimeout(()=>{
                    this.setData({
                        show:false
                    })
                },400)
            }).exec() 
        }
    }
})
