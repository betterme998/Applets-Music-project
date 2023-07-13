// components/double-click/double-click.js
Component({
    properties: {
    },
    data: {
        newTimeClick:0,
        iconArray:[],
        showIconPraise:false
    },
    methods: {
        // 点赞
        onClickLike(res){
            let time = new Date().getTime()
            this.data.newTimeClick = time
            if (this.data.iconArray.length >=2) {
                let att = [...this.data.iconArray]
                setTimeout(()=>{
                    att.shift()
                    this.setData({
                        iconArray:att
                    })
                },500)
            }
            this.data.timesclick = setTimeout(()=>{
                if (time !== this.data.newTimeClick) {
                    this.triggerEvent('doubleClickBom')
                    this.data.moreClick = true 
                    let arr = []
                    arr = [...this.data.iconArray]
                    let x = res.detail.x 
                    let y = res.detail.y - 50
                    arr.push({
                        iconX:x,
                        iconY:y
                    })
                    this.setData({
                        iconArray:arr,
                        showIconPraise:true,
                    })
                }else{
                    if (this.data.iconArray.length >=2) {
                        let arr = [...this.data.iconArray]
                        let last = arr.slice(arr.length - 1)
                        this.setData({
                            iconArray:last
                        }) 
                    }
                    setTimeout(()=>{
                        this.setData({
                            showIconPraise:false,
                            iconArray:[]
                        })
                    },500)
                }
            },500)
        }
    }
})
