// components/search-detail/search-detail.js
Component({
    properties: {
        rankingInfosItem:{
            type:Object,
            value:{}
        }
    },
    lifetimes: {
        attached: function() {
            // console.log(this.properties.rankingInfosItem.tracks);
        }
    },
    observers: {
        'rankingInfosItem': function(rankingInfosItem) {
            this.triggerEvent('swiperEvent')
        }
    },
    data: {
        key:-1
    },
    methods: {
        onDetailItem(event){
            console.log(event);
            let text = event.currentTarget.dataset.text
            let key = Number(event.currentTarget.dataset.index)
            this.setData({
                key
            })
            this.triggerEvent('detailItem',text)
        }
    }
})
