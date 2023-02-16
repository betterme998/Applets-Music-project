// pages/09_learn_api/index.js
import { hyrequest,hyReqInstance } from "../../service/index"
Page({
  data: {
    allCities:{},
    houselist:[],
    currentPage:1
  },
  async onLoad() {
    // 1.网络请求基本使用
    // wx.request({
    //   url: 'http://123.207.32.32:1888/api/city/all',
    //   success:(res)=>{
    //     const data = res.data.data
    //     this.setData({
    //       allCities:data
    //     })
    //   },
    //   fail:(err) => {
    //     console.log(err);
    //   }
    // })
    // wx.request({
    //   url: 'http://123.207.32.32:1888/api/home/houselist',
    //   data:{
    //     page:1
    //   },
    //   success: (res) => {
    //     const data = res.data.data
    //     this.setData({ houselist: data })
    //   }
    // })

    // 2.使用封装的函数
    // hyrequest({
    //   url:"http://123.207.32.32:1888/api/city/all",
    // }).then(res => {
    //   this.setData({ allCities:res.data })
    // })

    // hyrequest({
    //   url:"http://123.207.32.32:1888/api/home/houselist",
    //   data:{
    //     page:this.data.currentPage
    //   }
    // }).then(res => {
    //   this.setData({  houselist: res.data })
    // })

    // 3.await/async
    // const cityRes = await hyrequest({ url:"http://123.207.32.32:1888/api/city/all" })
    // this.setData({ allCities:cityRes.data })

    // const houseRes = await hyrequest({
    //   url:"http://123.207.32.32:1888/api/home/houselist",
    //   data: { page:1 }
    // })
    // this.setData({ houselist: houseRes.data })


    // 4.将请求封装到一个单独函数中
    this.getCityData()
    this.getHouselistData()

    // 5.使用类的实例发送请求
    hyReqInstance.get({
      url:"/city/all"
    }).then(res => {
      console.log(res);
    })
  },
  async getCityData() {
    const cityRes = await hyrequest({ url:"http://123.207.32.32:1888/api/city/all" })
    this.setData({ allCities:cityRes.data })
  },
  async getHouselistData() {
    const houseRes = await hyrequest({
      url:"http://123.207.32.32:1888/api/home/houselist",
      data: { page:this.data.currentPage }
    })
    const finalHouseList = [...this.data.houselist,...houseRes.data]
    this.setData({ houselist:finalHouseList })
    this.data.currentPage++
  },

  onReachBottom(){
    console.log(this.data.currentPage);
    this.getHouselistData()
  }
})