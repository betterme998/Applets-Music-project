// components/singer-Item/singer-Item.js
Component({
    options:{
        multipleSlots:true
    },
    properties: {
        songList:{
            type:Object,
            value:{}
        },
        round:{
            type:Boolean,
            value:false
        },
        userBo:{
            type:Boolean,
            value:false
        },
        user:{
            type:Boolean,
            value:false
        },
        keyWorld:{
            type:String,
            value:''
        },
        details:{
            type:Boolean,
            value:true
        }
    },
    data: {
        interest:false,
        text:'关注'
    },
    methods: {
        onInterestFn() {
            if (this.data.interest) {
            this.setData({ text:'关注'})
            console.log('关注');
            }else{
            this.setData({ text:'已关注'})
            console.log('已关注');

            }
            this.setData({ interest: !this.data.interest})
        },
        onSingerItem(event) {
            const id = this.properties.songList.id
            if (this.properties.user) {
                let userItem = encodeURIComponent(JSON.stringify(this.properties.songList))
                wx.navigateTo({
                    url: `/packageUser/pages/user-message/user-message?user=${userItem}`,
                })
            }else{
                wx.navigateTo({
                    url: `/pages/detail-song/detail-song?type=menu&id=${id}`,
                })
            }
        }
    }
})
