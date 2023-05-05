// pages/detail-search/detail-search.js
import { object } from "underscore";
import { searchPropose, search, searchRecommend } from "../../services/search"
import { getMVRel } from "../../services/video"
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
        videoHeight:0,
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
            {tabTitle:'歌单',name:'song'},
            {tabTitle:'视频',name:'video'},
            {tabTitle:'歌手',name:'singer'},
            {tabTitle:'电台',name:'radio'},
        ],

        // 搜索结果
        singleList:[],
        singleAll:[],
        songAll:[],
        shiftingIndex:0,
        videoIndex:0,
        songIndex:0,
        // 猜你喜欢
        songList:{},
        singerList:{},
        // 视频
        MVList:[],
        MVAllList:[],
        videoTabs:false
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
    getTabItemValue(e){
        if (this.data.singleAll.length === 0 && e.detail === 1) {
            this.searchSingle(this.data.searchValue)
        }
        if (this.data.songAll.length === 0 && e.detail === 2) {
            this.searchSong(this.data.searchValue)
        }
        if (this.data.MVAllList.length === 0 && e.detail === 3) {
            this.searchVideo(this.data.searchValue)
            this.getVideoHeight()
            this.IntersectionObserver()
            this.setData({
                videoTabs:true
            })
        }else{
            this.setData({
                videoTabs:false
            })
        }
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
    // 整合请求数据
    handleValue(res,num,keyWord){
        if (num === 1000) {
            let playList = res.data.result.playlists
            playList.map((item)=> {
                let key = "歌单:"+item.name
                let nameObj = this.keyWordFn(key,keyWord)
                item.nameObj = nameObj
            })
            return playList
        }
        if (num === 100) {
            let playList = res.data.result.artists
            playList.map((item)=> {
                let key = "歌手:"+item.name
                let nameObj = this.keyWordFn(key,keyWord)
                item.nameObj = nameObj
            })
            return playList
        }
    },
    // 监听视频到指定位置播放
    IntersectionObserver() {
        let intersectionObserver = wx.createIntersectionObserver({ observeAll: true})
        console.log(intersectionObserver);
        intersectionObserver.relativeTo('.relativeView')
        .observe(".videoItem",(res) =>{
            console.log(res);
        })
        // wx.createIntersectionObserver(this, {
        //     thresholds: [0.2, 0.5]
        // }).relativeTo('.relativeView').relativeToViewport().observe('.iddleItem', (res) => {
        //     console.log(res);
        // res.intersectionRatio // 相交区域占目标节点的布局区域的比例
        // res.intersectionRect // 相交区域
        // res.intersectionRect.left // 相交区域的左边界坐标
        // res.intersectionRect.top // 相交区域的上边界坐标
        // res.intersectionRect.width // 相交区域的宽度
        // res.intersectionRect.height // 相交区域的高度
        // })
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
        this.setData({singleList:[],singleAll:[],songAll:[]})
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
                let singerList = this.handleValue(res,100,keyWord)
                this.setData({
                    singerList
                })
            })
            search(keyWord,5,1000).then(res => {
                let songList = this.handleValue(res,1000,keyWord)
                this.setData({
                    songList
                })
            })
            search(keyWord,5,1014).then(res => {
                let MVList = res.data.result.videos
                this.setData({
                    MVList
                })
                //mv 
                // getMVRel(MV).then(res => {
                //     console.log(res);
                // })
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
                let singerList = this.handleValue(res,100,keyWord)
                this.setData({
                    singerList
                })
            })
            search(this.data.searchValue,5,1000).then(res => {
                let songList = this.handleValue(res,1000,keyWord)
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
    // 歌曲上拉下拉
    searchSingle(keyWord){
        search(keyWord,30,1,this.data.shiftingIndex * 30).then(res => {
            let singleAll = res.data.result.songs
            this.setData({
                singleAll
            })
        })
    },
    // 歌单上拉下拉
    searchSong(keyWord){
        search(keyWord,30,1000,this.data.songIndex * 30).then(res => {
            console.log(res);
            let songList = this.handleValue(res,1000,keyWord)
            this.setData({
                songAll:songList
            })
        })
    },
    //视频上拉下拉
    searchVideo(keyWord){
        search(keyWord,10,1014,this.data.videoIndex * 10).then(res => {
            console.log(res);
            let MVAllList = res.data.result.videos
            this.setData({
                MVAllList
            })
        })
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
    // 获取视频高度+nav+tab高度
    getVideoHeight() {
        let query = wx.createSelectorQuery();
        query.select('.iddleItem').boundingClientRect(res =>{
            if (res.height) {
            console.log(res);

                let videoHeight = res.height * .8 + this.data.resultTop
                this.setData({
                    videoHeight
                })   
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

    // 数据处理 搜索文本匹配 active
    keyWordFn(key,keyWord){
        let arr = key.split(keyWord)
        let textArr = new Array();

        arr.forEach((item,index)=>{
            let objText = {
                text:item,
                active:false
            }
            let objKey = {
                text:keyWord,
                active:true
            }
            if (index+1 !== arr.length) {
                textArr.push(objText)
                textArr.push(objKey)
            }else{
                textArr.push(objText)
            }
        })
        let newArr = textArr.filter((item)=>{
            if (item.text !== '') {
                return true
            }
        })
        return newArr
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