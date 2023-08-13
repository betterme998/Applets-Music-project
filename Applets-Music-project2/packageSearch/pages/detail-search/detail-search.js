// pages/detail-search/detail-search.js
import { object } from "underscore";
import { searchPropose, search, searchRecommend } from "../../../services/search"
import { getMVRel,getMVInfo,getMVRelate } from "../../../services/video"
import rankingStore, {rankingsIds} from "../../../store/rankingStore";
import { debounce } from "../../../utils/debounce";
import playerStore from "../../../store/playerStore"

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
        tabKeyActive:'comprehensive',
        tabsValue:[
            {tabTitle:'综合',name:'comprehensive'},
            {tabTitle:'单曲',name:'single'},
            {tabTitle:'歌单',name:'song'},
            {tabTitle:'视频',name:'video'},
            {tabTitle:'歌手',name:'singer'},
            {tabTitle:'用户',name:'radio'},
        ],

        // 搜索结果
        singleList:[],
        singleAll:[],
        songAll:[],
        shiftingIndex:0,
        videoIndex:0,
        songIndex:0,
        userIndex:0,
        // 猜你喜欢
        songList:{},
        singerList:{},
        useList:{},
        // 视频
        MVList:[],
        MVAllList:[],
        mvLangth:0,
        mvCount:0,
        userLangth:0,
        videoPlay:{},
        videoTabs:false,
        interest:false,
        // 用户
        user:{},
        userAll:[],
        // 歌手
        singerAll:[],

        // 播放工具栏
        // tabbar高度
       tabbarHeight:0,

        // 播放栏
        playModeIndex:0,
        playSongIndex:0,
        playSongList:[],

        // 歌曲信息
        currentSong:{},
        isPlaying:false,

        // 聚焦
        HomeFocus:true,

        // 下拉
        scrollBottom:false
    },
    onLoad() {
        this.setData({menuRight:app.globalData.menuRight,tabbarHeight: app.globalData.tabbarHeight})
        this.servicesRecommend()

        // 获取高度
        this.getNavTabHeight()
        // 获取本地搜索记录
        this.getHistoryFn()
        // 喜欢推荐
        this.getLoveSong()
        // store
        this.storeEnjoy()
        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)
        
    },
    onShow(){
        this.setData({
            HomeFocus:app.globalData.HomeFocus
        })

        // // 接收返回数据
        // let pages = getCurrentPages();
        // let currPage = pages[pages.length-1];
        // if (currPage.data.isPlaying) {
        //     this.setData({
        //         isPlaying:true
        //     })
        //     playerStore.dispatch("playMusicStatusAction")  
        // }
    },
    onUnload(){
        clearInterval(this.timer),
        rankingStore.offState("newRanking",this.getRankingHanlder)
        rankingStore.offState("originRanking",this.getRankingHanlder)
        rankingStore.offState("upRanking",this.getRankingHanlder)

        playerStore.offStates(["currentSong","isPlaying"], this.handlePlayInfos)
        playerStore.offStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
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
                nolistShow:false,
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
        if (this.data.Proposeresult || this.data.ProposeListShow) {
            this.setData({Proposeresult:false, ProposeListShow:false, searchValue:''})
            return
        }
        wx.navigateBack()
    },
    async getTabItemValue(e){
        this.setData({tabKeyActive:e.detail})
        console.log(typeof(e.detail));
        if (this.data.singleAll.length === 0 && e.detail === 1) {
            this.searchSingle(this.data.searchValue)
        }
        if (this.data.songAll.length === 0 && e.detail === 2) {
            this.searchSong(this.data.searchValue)
        }
        if (this.data.MVAllList.length === 0 && e.detail === 3) {
            await this.searchVideo(this.data.searchValue)
            this.setData({
                videoTabs:true
            })
        }else if (this.data.MVAllList.length !== 0 && e.detail === 3) {

        }else{
            if (this._listen) this._listen.disconnect()
            clearInterval(this.setInters)
            this.setData({
                videoTabs:false
            })
        }
        if (this.data.singerAll.length === 0 && e.detail === 4) {
            await this.searchSinger(this.data.searchValue)
        }
        if (this.data.userAll.length === 0 && e.detail === 5) {
            await this.searchUser(this.data.searchValue)
        }
    },
    videoEvent(){
        console.log("停止滚动");
    },
    async onscrolltolowerb(e){
        if ((e.detail === "single") && !this.data.scrollBottom) {
            // 单曲
            this.data.shiftingIndex = this.data.singleAll.length
           this.searchSingle(this.data.searchValue)
        }
        if ((e.detail === "song")&& !this.data.scrollBottom) {
            // 歌单
            this.data.songIndex = this.data.songAll.length
            this.searchSong(this.data.searchValue)
        }
        if ((e.detail === "video")&& !this.data.scrollBottom) {
            // 视频
            this.data.videoIndex = this.data.MVAllList.length
            await this.searchVideo(this.data.searchValue)
            this.IntersectionObserver()
        }
        if ((e.detail === "singer")&& !this.data.scrollBottom) {
            // 歌手
            this.data.singerLangth = this.data.singerAll.length
            this.searchSinger(this.data.searchValue)
        }
        if ((e.detail === "radio")&& !this.data.scrollBottom) {
            // 用户
            this.data.userIndex = this.data.userAll.length
            this.searchUser(this.data.searchValue)
        }
    },
    onSingleItem(event) {
        let index = event.currentTarget.dataset.index
        // 1.拿到播放列表. 放到store的第三方库中
        playerStore.setState("playSongList",this.data.singleAll)
        playerStore.setState("playSongIndex",index)
    },
    // 查看更多
    setTabItemActive(event) {
        let values = event.detail
        this.setData({
            tabKeyActive:values
        })

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
    historyItemFn(event){
        wx.nextTick(() => {
            let text = event.detail
            this.setData({
                searchValue:text
            })
            this.searchGetFn(event)
        })
    },
    // show生命周期
    RecommendNum() { 
        let index = 1
        this.setData({
            RecommendText:this.data.RecommendList[0].first
        });
        //定时器  函数赋值给timer  方便clearInterval（）使用
        this.timer = setInterval(()=>{
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
    handleValue(res,num,keyWord,a = false){
        if (num === 1000) {
            let playList = res.data.result.playlists
            playList.map((item)=> {
                let key = "歌单:"+item.name
                let nameObj = this.keyWordFn(key,keyWord)
                item.nameObj = nameObj
            })
            return playList
        }
        if (num === 100 && !a) {
            let playList = res.data.result.artists
            playList.map((item)=> {
                let key = "歌手:"+item.name
                let nameObj = this.keyWordFn(key,keyWord)
                item.nameObj = nameObj
            })
            return playList
        }
        if (num === 100 && a) {
            let playList = res.data.result.artists
            playList.map((item)=> {
                let key = item.name
                let nameObj = this.keyWordFn(key,keyWord)
                item.nameObj = nameObj
            })
            return playList
        }
    },
    // 监听视频到指定位置
    IntersectionObserver() {
        let that = this
        this._listen = wx.createIntersectionObserver(this,{ observeAll: true})
        this._listen
            .relativeTo('.relativeView')
            .observe(".videoItem",(res) =>{
                this.playVideo(res,that)
            })
    },
    // 视频播放前几秒
    playVideo:debounce((res,that)=>{
        console.log(res);
        let idArray = new Array()
        if (res.intersectionRatio>0) {
            let id = res.dataset.id
            idArray.push(id)
            if (idArray.length>2) {
                idArray.shift()
            }
            if (idArray[0] !== idArray[1]) {
                that.setData({videoPlay:{}})
                that.searchVideoPlay(id,that)
                that.getvideoItem(res.dataset.index)   
            }
        }
    },500),

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
        this.setData({singleList:[],singleAll:[],songAll:[],MVAllList:[],singerAll:[],userAll:[],nolistShow:false})
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
            search(keyWord,3,100).then(res => {
                let singerList = this.handleValue(res,100,keyWord)
                this.setData({
                    singerList
                })
            })
            search(keyWord,1,1002).then(res => {
                let user = res.data.result.userprofiles
                this.setData({
                    user
                })
            })
            search(keyWord,5,1000).then(res => {
                let songList = this.handleValue(res,1000,keyWord)
                this.setData({
                    songList
                })
            })
            search(keyWord,5,1004).then(res => {
                let MVList = res.data.result.mvs
                this.setData({
                    MVList
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
            search(this.data.searchValue,3,100).then(res => {
                let singerList = this.handleValue(res,100,keyWord)
                this.setData({
                    singerList
                })
            })
            search(this.data.searchValue,1,1002).then(res => {
                let user = res.data.result
                this.setData({
                    user
                })
            })
            search(this.data.searchValue,5,1000).then(res => {
                let songList = this.handleValue(res,1000,keyWord)
                this.setData({
                    songList
                })
            })
            search(this.data.searchValue,5,1004).then(res => {
                let MVList = res.data.result.mvs
                this.setData({
                    MVList
                })
            })
            this.setData({Proposeresult:true,ProposeListShow:false})
        }
        if (this.data.resultTop === 0) {
            this.getNavTabHeight()
        }
        this.getHeight()
    },
    // 歌曲上拉下拉
    async searchSingle(keyWord){
        this.setData({
            scrollBottom:true
        })
        await search(keyWord,30,1,this.data.shiftingIndex).then(res => {
            // 2.将新数据追加到原数据后面
            const newSingleAll = [...this.data.singleAll,...res.data.result.songs]
            // 3.设置全新数据
            this.setData({singleAll:newSingleAll})
        }).catch(()=>{
            this.setData({
                scrollBottom:false
            })
        })
        this.setData({
            scrollBottom:false
        })
    },
    // 歌单上拉下拉
    async searchSong(keyWord){
        this.setData({
            scrollBottom:true
        })
        await search(keyWord,30,1000,this.data.songIndex).then(res => {
            let songList = this.handleValue(res,1000,keyWord)
            const newSingleAll = [...this.data.songAll,...songList]
            this.setData({
                songAll:newSingleAll
            })
        }).catch(()=>{
            this.setData({
                scrollBottom:false
            })
        })
        this.setData({
            scrollBottom:false
        })
    },
    //视频上拉下拉
    async searchVideo(keyWord){
        this.setData({
            scrollBottom:true
        })
        if ((this.data.mvLangth == this.data.MVAllList.length)&&this.data.mvLangth>0) {
            this.setData({
                scrollBottom:false
            })
            return
        }
        await search(keyWord,10,1004,this.data.videoIndex).then(res => {
            let mvCount = res.data.result.mvCount
            let MVAllList = res.data.result.mvs
            let mvLangth = res.data.result.mvCount
            const newMVAllList = [...this.data.MVAllList,...MVAllList]
            this.data.mvLangth = mvLangth
            this.data.mvCount = mvCount
            this.setData({
                MVAllList:newMVAllList
            })
        }).catch(()=>{
            this.setData({
                scrollBottom:false
            })
        })
        this.setData({
            scrollBottom:false
        })
    },
    //歌手上拉下拉
    searchSinger(keyWord){
        this.setData({
            scrollBottom:true
        })
        if ((this.data.singerLangth == this.data.singerAll.length)&&this.data.singerLangth>0) {
            this.setData({
                scrollBottom:false
            })
            return
        }
        search(keyWord,20,100,this.data.singerLangth).then(res => {
            let a = true
            let singerAll = this.handleValue(res,100,keyWord,a)
            let singerLangth = res.data.result.artistCount
            const newSingerAll = [...this.data.singerAll,...singerAll]
            this.data.singerLangth = singerLangth
            this.setData({
                singerAll:newSingerAll
            })
        }).catch(()=>{
            this.setData({
                scrollBottom:false
            })
        })
        this.setData({
            scrollBottom:false
        })
    },
    //用户上拉下拉
    async searchUser(keyWord){
        this.setData({
            scrollBottom:true
        })
        if ((this.data.userLangth == this.data.userAll.length)&&this.data.userLangth>0) {
            this.setData({
                scrollBottom:false
            })
            return
        }
        await search(keyWord,20,1002,this.data.userIndex).then(res => {
            let userAll  = res.data.result.userprofiles
            let userLangth = res.data.result.userprofileCount
            const newUserAll = [...this.data.userAll,...userAll]
            this.data.userLangth = userLangth
            this.setData({
                userAll:newUserAll
            })
        }).catch(()=>{
            this.setData({
                scrollBottom:false
            })
        })
        this.setData({
            scrollBottom:false
        })
    },
    // 视频播放
    searchVideoPlay:debounce((id,that)=>{
        // 包含字符串的id
        // let re = /^(?![^a-zA-Z]+$)(?!\D+$)/
        getMVRel(id).then(res => {
            let videoPlay = res.data.data
            that.setData({
                videoPlay
            })
        })
    },1000),
    // 视频控件
    // 获取nav+tab高度
    getNavTabHeight() {
        let query = wx.createSelectorQuery();
        query.select('.navCont').boundingClientRect(res =>{
            let homeTop = res?.height
            let bodyHeight = app.globalData.screeHeight
            if (!this.data.Proposeresult&&!this.data.ProposeListShow) {
                this.setData({ homeTop, bodyHeight})
            }
            
        }).exec();
        
    },
    // 获取搜索结果高度
    getHeight() {
        if (this.data.resultHeight > 0 && !this.data.isPlaying) return
        let query = wx.createSelectorQuery();
        query.select('.slotScroll').boundingClientRect(res =>{
            let top = res.top
            let height = app.globalData.screeHeight - top
            if (this.data.isPlaying) {
                height = app.globalData.screeHeight - top - this.data.tabbarHeight
            }
            this.setData({resultHeight:height})
        }).exec();
    },
    getSwiperHeight() {
        let query = wx.createSelectorQuery();
        query.select('.swiperConts').boundingClientRect(res =>{
            if (res.height !== undefined) {
                let swiperHeight = res.height 
                this.setData({swiperHeight})
            }
        }).exec();
    },
    mvPlay(event){
        let mins = event.currentTarget.dataset.mins
        let id = event.currentTarget.dataset.id
        let index = event.currentTarget.dataset.index
        let mvlist = encodeURIComponent(JSON.stringify(mins ? this.data.MVList : this.data.MVAllList))
        // 判断音乐是否播放
        if (this.data.isPlaying) {
            // 如果在播放音乐就暂停
            playerStore.dispatch("playMusicStatusAction")
        }
        wx.navigateTo({
            url: `/packageRollvide/pages/detail-rollvide/detail-rollvide?id=${id}&index=${index}&mvlist=${mvlist}&keyworld=${this.data.searchValue}&mvCount=${this.data.mvCount}&isPlays=${this.data.isPlaying}`,
        })
    },
    // 获取视频高度+nav+tab高度
    getVideoHeight() {
        if(this.data.videoHeight === 0) {
            console.log(11132);
            let query = wx.createSelectorQuery();
            query.select('.videoItem').boundingClientRect(res =>{
            if (res) {
                let videoHeight = res.height * .5 + res.top
                this.setData({
                    videoHeight
                })   
                this.IntersectionObserver()
            }
            }).exec();
        }
    },
    getvideoItem(index) {
        // setTimeout(()=>{
        //     let classItem = '.mvItem'+index
        //     let query = wx.createSelectorQuery().in(this.selectComponent(classItem));
        //     query.select('.video').boundingClientRect(res =>{
        //         let videoContext = wx.createVideoContext('video',this.selectComponent(classItem))
        //         clearInterval(this.setInters)
        //         this.setInters = setInterval(()=>{
        //             videoContext.seek(0)
        //         },10000)
        //     }).exec();
        // },2000)
        let classItem = '.mvItem'+index
        let query = wx.createSelectorQuery().in(this.selectComponent(classItem));
        query.select('.video').boundingClientRect(res =>{
            let videoContext = wx.createVideoContext('video',this.selectComponent(classItem))
            clearInterval(this.setInters)
            this.setInters = setInterval(()=>{
                videoContext.seek(0)
            },10000)
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
    //============================== 从Store中获取数据 ==============================
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
    getPlaySonginfosHandler({playSongList,playSongIndex,playModeIndex}) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
        if (playModeIndex !== undefined) {
            this.setData({ playModeIndex })
        }
    },
    handlePlayInfos({ currentSong, isPlaying }) {
        if (currentSong) {
            this.setData({currentSong})
        }
        if (isPlaying !== undefined) {
            this.setData({isPlaying})
        }
    },

    

})