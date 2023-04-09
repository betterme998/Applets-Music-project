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
            console.log(this.properties.rankingInfosItem.tracks);
        }
    },
    data: {

    },
    methods: {

    }
})
