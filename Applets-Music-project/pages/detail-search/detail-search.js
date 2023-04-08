// pages/detail-search/detail-search.js
import { searchPropose, search, searchRecommend } from "../../services/search"


const app = getApp()
let listMap = new Array()
let listMapSet = new Set()
Page({
    data: {
        searchValue: "",
        values:'',
        ProposeListShow:false,
        Proposeresult:false,
        loading:false,
        searchHome:true,
        ProposeListValue:[],
        RecommendList:[],
        nolistShow:false,
        timer:{},
        RecommendText:'',
        focus:true,
        homeTop:0,
        resultTop:0,
        historyList:[],
        index:0,
        LoveList:[]
    },
    onLoad(options) {
        this.servicesRecommend()

        // 获取高度
        this.getNavTabHeight()
        // 获取本地搜索记录
        this.getHistoryFn()
        // 喜欢推荐
        this.getLoveSong()
        
    },
    onUnload(){
        clearInterval(this.data.timer)
    },
    // 事件监听
    onPromptFn(event) {
        console.log(event);
        if (event.detail) {
            this.setData({
                ProposeListShow:true,
                values:event.detail,
                ProposeListValue:[]
            })
            this.ServicesPromptFn(event.detail)
        }else{
            this.setData({
                ProposeListShow:false,
                loading:false,
                values:'',
                ProposeListValue:[]
            })
        }
    },
    onfingerboardSearch(event) {
        this.searchGetFn(event)
    },
    onFocus(event){
        console.log(event);
        this.setData({
            focus:false
        })
        if (event.detail.value) {
            this.setData({
                Proposeresult:false,
                ProposeListShow:true
            })
            this.ServicesPromptFn(event.detail.value)
        }
    },
    onBlur(){
        this.setData({focus:true})
    },


    // 自定义事件
    keyWorldSearch(event) {
        let keyword = event.detail.keyword
        


        // search(keyword).then(res => {
        //     console.log(res);
        // })
        // search(keyword,30,10).then(res => {
        //     console.log(res);
        // })
    },
    deleteEmitFn(){
        listMap=[]
        this.setData({
            historyList:[],
            historyListShow:false
        })
    },
    // show生命周期
    RecommendNum() { 
        let index = 1
        this.setData({
            RecommendText:this.data.RecommendList[0].first
        });
        //定时器  函数赋值给timer  方便clearInterval（）使用
        let timer = setInterval(()=>{
            if (this.data.focus) {
                this.setData({
                    RecommendText:this.data.RecommendList[index].first
                });
                index++
                if (index >= this.data.RecommendList.length) {
                    index = 0
                }
            }
        },5000);
        this.setData({
            timer
        });
    },
    // 猜你喜欢
    async getLoveSong(){
        let newList = this.data.historyList
        if (newList.length>0) {
            let data = await search(newList[this.data.index],1)
            let wordKey = data.data.result.songs[0].ar[0].name
            search(wordKey,5).then(res =>{
                console.log(res);
                if (res.data.result.songs[0].name) {
                    let loveArrays = res.data.result.songs
                    let LoveList = loveArrays.filter(item =>{
                        if (item.name !== 'Undefined' && item.name) {
                            return item
                        }
                    }).map(res =>{
                        return res.name
                    })
                    this.setData({
                        LoveList,
                        index:this.data.index + 1
                    })

                }
            })
        }
        if (this.data.index >= newList.length) this.setData({index:0})
    },

    // 网络请求
    async servicesRecommend(){
        await searchRecommend().then(res => {
            this.setData({RecommendList:res.data.result.hots})
        })
        this.RecommendNum()
    },
    ServicesPromptFn(event){
        var loadingTime = setTimeout(()=>{
            this.setData({
                loading:true
            })
        },200)
        searchPropose(event).then(res => {
            if (res.data.result.allMatch === undefined) {
                this.setData({nolistShow:true})
            }else{
                this.setData({nolistShow:false})
            }
            this.setData({loading:false,ProposeListValue:res.data.result.allMatch})
        }).catch(err =>{
            console.log(err);
        }).finally(() =>{
            clearTimeout(loadingTime)
        })
    },
    searchGetFn(event){//搜索结果函数
        if (event.detail) {
            listMap.unshift(event.detail)
            if (listMap.length>10) {
                listMap.pop()
            }
            listMapSet.clear()
            listMap.forEach(element => {
                listMapSet.add(element)
            });
            let newLists = [...listMapSet]
            wx.setStorageSync('history',newLists)
            this.setData({Proposeresult:true,ProposeListShow:false,historyListShow:true})
            search(event.detail).then(res => {
                console.log(res);
            }).finally(()=>{
                this.setData({historyList:newLists,index:newLists.length})
            })
        }else {
            listMap.unshift(this.data.RecommendText)
            if (listMap.length>10) {
                listMap.pop()
            }
            listMapSet.clear()
            listMap.forEach(element => {
                listMapSet.add(element)
            });
            let newLists = [...listMapSet]
            this.setData({searchValue:this.data.RecommendText,historyListShow:true})
            wx.setStorageSync('history',newLists)
            search(this.data.searchValue).then(res => {
                console.log(res);
            }).finally(()=>{
                this.setData({historyList:newLists,index:newLists.length})
            })
            this.setData({Proposeresult:true,ProposeListShow:false})
        }
        if (this.data.resultTop === 0) {
            this.getNavTabHeight()
        }
    },

    // 获取nav+tab高度
    getNavTabHeight() {
        let query = wx.createSelectorQuery();
        query.select('.navCont').boundingClientRect(res =>{
            let homeTop = res.height * app.globalData.devicePixelRatio
            if (!this.data.Proposeresult&&!this.data.ProposeListShow) {
                this.setData({ homeTop})
            }
            if (this.data.Proposeresult) {
                this.setData({ resultTop:homeTop})
            }
            
        }).exec();
    },
    

    // 本地记录
    getHistoryFn() {
        // 获取本地历史记录
        let that = this
        let historyList =wx.getStorageSync("history")
        if (historyList.length) { // 本地如果有缓存列表，提前渲染
            listMap = historyList
            that.setData({
                historyList,
                historyListShow:true,
                index:listMap.length
            })
        }else{
            that.setData({
                historyListShow:false
            })
        }
    },

    

})