// components/srarch-history/srarch-history.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {search} from '../../services/search'
const app = getApp()
Component({
    // 多个插槽要加上这个
    options:{
        multipleSlots:true
    },
    properties: {
        historyList:{
            type:Array,
            value:[]
        },
        historyShow:{
            type:Boolean,
            value:false
        }
    },
    data: {
        allitem:false,
        itemwidth:0,
        itemConterWidth:0,
        indexItem:0,
        mistHistoryList:[]
    },
    lifetimes: {
        attached: function() {
        }
    },
    observers: {
        'historyList': function(historyList) {
          this.getCachedMap()
        }
    },
    methods: {
        deleteHistory(){
            Dialog.confirm({
                message: '弹窗内容',
                context:this
            })
            .then(() => {
                wx.removeStorageSync('history')
                this.triggerEvent('deleteEmit')
            })
            .catch(() => {
                // on cancel
            });
            
        },

        // 监听事件
        onclickLastItem() {
            this.setData({allitem:!this.data.allitem})
        },

        // 计算胶囊位置
        getCachedMap() {
            let query = wx.createSelectorQuery().in(this);
            if (this.data.itemwidth === 0 || this.data.itemConterWidth === 0) {
                this.getWidth(query)
            }
            query.selectAll('.itemHistory').boundingClientRect(res =>{
                if (res.length !== 0) {
                    let itemAdd = 0 
                    let newItem = res.filter((item,index) =>{
                        itemAdd = item.width * app.globalData.devicePixelRatio + itemAdd +16
                        if (itemAdd + this.data.itemwidth <= this.data.itemConterWidth) {
                           return item
                        }
                    })
                    let mistList = this.properties.historyList
                    let mistHistoryList = mistList.slice(0,newItem.length)
                    this.setData({
                        mistHistoryList
                    })
                }
            }).exec();
        },
        getWidth(query){
            //获取历史记录宽度
            query.select('.lastitem').boundingClientRect(res =>{
                if (res) {
                    let itemwidth = res.width * app.globalData.devicePixelRatio 
                    this.setData({itemwidth})
                }
            }).exec();
            query.select('.itemHeader').boundingClientRect(res =>{
                if (res) {
                    let itemConterWidth = res.width * app.globalData.devicePixelRatio 
                    this.setData({itemConterWidth})
                }
            }).exec();
        }

        
    }
})
