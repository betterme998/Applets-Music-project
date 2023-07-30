// pages/user-Message/user-message.js
import playerStore from "../../store/playerStore"
import { getCity } from "../../services/map"
import { debounce } from "../../utils/debounce"
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
let qqmapsdk;
const app = getApp()
Page({
    data: {
        mvlist:{},
        imageHeight:0,
        minHeight:0,
        userHeight:0,
        // 播放栏
        tabbarHeight:0,
        playModeIndex:0,
        playSongIndex:0,
        playSongList:[],
        currentSong:{},
        isPlaying:false,

        // 下拉
        triggered:false,
        enableds:true,
        // bounces:false,

        // 动画
        activescroll:false,
        comeInfo:false,

        // 滑动方向
        numArr:[],

        // 城市
        provinceData:[],
        cityData:[]

    },
    onLoad(options) {
        this.setData({tabbarHeight: app.globalData.tabbarHeight})
        // 处理传过来的数据
        let a = decodeURIComponent(options.user)
        let mvlist = JSON.parse(a)
        this.setData({mvlist})

        // 获取照片显示高度
        this.setData({
            imageHeight:app.globalData.screeWidth * 0.59444,
            minHeight:app.globalData.screeWidth * 0.2,
            bodyHeight:app.globalData.screeHeight,
            scrollTop:app.globalData.screeHeight
        })

        // 获取内部滑块高度
        this.getUserInfosHeight()

        // 共享store
        playerStore.onStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
        playerStore.onStates(["currentSong","isPlaying"], this.handlePlayInfos)

        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'HHSBZ-ZUYCQ-BKH54-BPRDD-BBBLQ-CDBKV'
        });
        // 获取城市
        this.getCitys()
        
    },
    onNavBackTap(){
        if (this.data.activescroll) {
            this.setData({
                activescroll:false,
                comeInfo:true
            })
        }else{
            app.globalData.HomeFocus = false
            wx.navigateBack()
        }
    },
    bindrefresherrefresh(){
        this.setData({
            triggered:false
        })
    },
    bindtouchmove(event){
        if (this.data.enableds) {
            let that = this
            let arr = [...this.data.numArr]
            arr.push(event.changedTouches[0].clientY)
            if (arr.length>2) {
                arr.shift()
            }
            this.data.numArr = arr
        }
    },
    bindrefresherrestore(){
        if (this.data.numArr[1]>=this.data.numArr[0]) {
            this.setData({
                activescroll:true,
                comeInfo:false
            })
        }
    },
    bindscroll(){
        if (this.data.enableds) {
            this.setData({
                enableds:false
            })
        }
    },
    bindscrolltoupper(){
        this.setData({
            enableds:true
        })
    },
    getUserInfosHeight(){
        let query = wx.createSelectorQuery();
        query.select('.addCom').boundingClientRect(res =>{
            if (res.height > 0) {
                let userHeight = res.height
                this.setData({
                    userHeight
                })
            }
            
        }).exec();
    },
    // 城市请求
    getCitys(keyword){
        var _this = this;
        // 调用接口
         //调用获取城市列表接口
        qqmapsdk.getCityList({
            success: function(res) {//成功后的回调
            _this.setData({
                provinceData:res.result[0]
            })
            //城市数据
            qqmapsdk.getDistrictByCityId({
                // 传入对应省份ID获得城市数据
                id: _this.data.mvlist.province, 
                success: function(res) {//成功后的回调
                _this.setData({
                    cityData:res.result[0]
                })
                _this.inquireCity(_this)
                },
                fail: function(error) {
                console.error(error);
                }
            });
            },
            fail: function(error) {
            console.error(error);
            }
        });
        
    },
    inquireCity(_this){
        let province =  [..._this.data.provinceData]
        let city = [..._this.data.cityData]
        const item = province.find((event)=>{
            event.id === _this.data.mvlist.province
        })
        const minitem = city.find((event)=>{
            event.id === _this.data.mvlist.city
        })
        console.log(_this.data.provinceData);
        console.log(_this.data.cityData);
    },
    onUnload(){
        app.globalData.HomeFocus = false

        playerStore.offStates(["currentSong","isPlaying"], this.handlePlayInfos)
        playerStore.offStates(["playSongList","playSongIndex","playModeIndex"],this.getPlaySonginfosHandler)
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