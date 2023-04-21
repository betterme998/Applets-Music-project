// pages/detail-search/detail-search.js
import { object } from "underscore";
import { searchPropose, search, searchRecommend } from "../../services/search"
import rankingStore, {rankingsIds} from "../../store/rankingStore";

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
        swiperHeight:800,
        resultTop:0,
        historyList:[],
        index:0,
        LoveList:[],
        renovate:true,
        // 巅峰榜数据
        rankingInfos:{},

        menuRight:0,
        bodyHeight:0,
        resultHeight:0,
        tabsValue:[
            {tabTitle:'综合',name:'comprehensive'},
            {tabTitle:'单曲',name:'single'},
            {tabTitle:'歌曲',name:'song'},
            {tabTitle:'视频',name:'video'},
            {tabTitle:'歌手',name:'singer'},
            {tabTitle:'电台',name:'radio'},
        ],

        // 搜索结果
        singleList:[],

        // 猜你喜欢
        songList:{},
        singerList:{}
    },
    onLoad(options) {
        this.setData({menuRight:app.globalData.menuRight})
        this.servicesRecommend()

        // 获取高度
        this.getNavTabHeight()
        // 获取本地搜索记录
        this.getHistoryFn()
        // 喜欢推荐
        this.getLoveSong()
        // store
        this.storeEnjoy()
        
    },
    onUnload(){
        clearInterval(this.data.timer),
        rankingStore.offState("newRanking",this.getRankingHanlder)
        rankingStore.offState("originRanking",this.getRankingHanlder)
        rankingStore.offState("upRanking",this.getRankingHanlder)
    },
    // 事件监听
    onPromptFn(event) {
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
    clearFn(){
        this.setData({Proposeresult:false})
    },
    onNavBackTap(){
        wx.navigateBack()
    },


    // 自定义事件
    keyWorldSearch(event) {
        setTimeout(()=>{
            this.searchGetFn(event)
        },300)        
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
        if (newList.length === 0) {
            newList = ['林俊杰','薛之谦','隔壁老樊','陈奕迅','李荣浩','华晨宇']
        }
        if (this.data.renovate) {
            let data = await search(newList[this.data.index],1)
            let wordKey = data.data.result.songs[0].ar[0].name
            this.data.renovate = false
            search(wordKey,5).then(res =>{
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
                this.data.renovate = true
            })
        }
        if (this.data.index >= newList.length) this.setData({index:0})
    },
    swiperEventFn(){
        this.getSwiperHeight()
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
                loading:true,
                ProposeListValue:[]
            })
        },100)
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
        this.setData({singleList:[]})
        let keyWord = ''
        if (typeof(event.detail) === 'object') {
            keyWord = event.detail.keyword
        }else if (typeof(event.detail) === 'string') {
            keyWord = event.detail
        }
        if (keyWord) {
            listMap.unshift(keyWord)
            if (listMap.length>10) {
                listMap.pop()
            }
            listMapSet.clear()
            listMap.forEach(element => {
                listMapSet.add(element)
            });
            let newLists = [...listMapSet]
            wx.setStorageSync('history',newLists)
            this.setData({Proposeresult:true,ProposeListShow:false,historyListShow:true,searchValue:keyWord})
            search(keyWord).then(res => {
                let singleList = res.data.result.songs
                this.setData({singleList})
            }).finally(()=>{
                this.setData({historyList:newLists,index:newLists.length})
            })
            search(keyWord,1,100).then(res => {
                console.log(res);
                let singerList = res.data.result
                singerList.title = "歌手:"
                this.setData({
                    singerList
                })
            })
            search(keyWord,1,1000).then(res => {
                console.log(res);
                let songList = res.data.result
                songList.title = "歌单:"
                this.setData({
                    songList
                })
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
                let singleList = res.data.result.songs
                this.setData({singleList})
            }).finally(()=>{
                this.setData({historyList:newLists,index:newLists.length})
            })
            search(this.data.searchValue,1,100).then(res => {
                let singerList = res.data.result.artists
                this.setData({
                    singerList
                })
            })
            search(this.data.searchValue,1,1000).then(res => {
                let songList = res.data.result
                this.setData({
                    songList
                })
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
            let homeTop = res.height
            let bodyHeight = app.globalData.screeHeight * app.globalData.devicePixelRatio
            if (!this.data.Proposeresult&&!this.data.ProposeListShow) {
                this.setData({ homeTop, bodyHeight})
            }
            if (this.data.Proposeresult) {
                let resultHeight = bodyHeight - (homeTop*app.globalData.devicePixelRatio)
                this.setData({ resultTop:homeTop,resultHeight})
            }
            
        }).exec();
        
    },
    getSwiperHeight() {
        let query = wx.createSelectorQuery();
        query.select('.swiperConts').boundingClientRect(res =>{
            if (res.height) {
                let swiperHeight = res.height 
                this.setData({swiperHeight})
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
                historyListShow:true
            })
        }else{
            that.setData({
                historyListShow:false
            })
        }
    },

    
    // 共享store 
    storeEnjoy(){
        // 高阶用法
        for (const key in rankingsIds) {
            rankingStore.onState(key,this.getRankingHanlder(key))
        }
    },
    // 高阶用法
    getRankingHanlder(ranking) {
        return value => {
            if (!value.name) return
            const newRankingInfos = { ...this.data.rankingInfos, [ranking]:value}
            for (const key in newRankingInfos) {
               let newTracksList = newRankingInfos[key].tracks
               let newTracksArray = newTracksList.slice(0,20)
               newRankingInfos[key].tracks = newTracksArray
            }
            this.setData({ rankingInfos: newRankingInfos })
        }
    },

    

})