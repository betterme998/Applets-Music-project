// pages/detail-search/detail-search.js
import { searchPropose, search, searchRecommend } from "../../services/search"
Page({
    data: {
        searchValue: "",
        values:'',
        ProposeListShow:true,
        loading:false,
        ProposeListValue:[],
        RecommendList:[],
        nolistShow:false,
        timer:{},
        RecommendText:'',
        focus:true
    },
    onLoad(options) {
        this.servicesRecommend()
    },
    onUnload(){
        clearInterval(this.data.timer)
    },
    // 事件监听
    onPromptFn(event) {
        if (event.detail) {
            this.setData({
                ProposeListShow:true,
                values:event.detail,
                ProposeListValue:[]
            })
            var loadingTime = setTimeout(()=>{
                this.setData({
                    loading:true
                })
            },200)
            searchPropose(event.detail).then(res => {
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
        console.log(event);
        if (event.detail) {
            search(event.detail).then(res => {
                console.log(res);
            })
        }else {
            this.setData({searchValue:this.data.RecommendText})
            console.log(this.data.searchValue);
            search(this.data.searchValue).then(res => {
                console.log(res);
            })
        }
        // this.setData({searchValue:this.data.RecommendText})
    },
    onFocus(){
        this.setData({focus:false})
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

    // 网络请求
    async servicesRecommend(){
        await searchRecommend().then(res => {
            this.setData({RecommendList:res.data.result.hots})
        })
        this.RecommendNum()
    }
})