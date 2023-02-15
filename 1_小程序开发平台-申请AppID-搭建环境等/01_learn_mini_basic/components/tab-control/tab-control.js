// components/tab-control/tab-control.js
Component({
  properties:{
    titles:Array,
    value:[]
  },
  data:{
    currentIndex:0
  },
  methods:{
    onItemTap(event){
      const currentIndex = event.currentTarget.dataset.index
      this.setData({currentIndex})

      // 自定义事件
      this.triggerEvent("indexchange",currentIndex)
    }
  }
})
