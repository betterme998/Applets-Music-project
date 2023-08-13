// components/video-list-time/video-list-time.js
Component({
    properties: {
        songList: {
            type: Object,
            dafault:{}
        }
    },
    methods: {
        onItemTap() {
            const item = this.properties.songList
            wx.navigateTo({
              url: `/packageVideo/pages/detail-video/detail-video?id=${item.id}&artistName=${item.artistName}`,
            })
        }
    }
})
