// components/menu-header/menu-header.js
import colorThief from "miniapp-color-thief"
Component({
    properties: {
        itemData:{
            type:Object,
            value:{}
        }
    },
    data:{
        mainColor:[]
    },
    attached: function() {
        // 在组件实例进入页面节点树时执行
    },
    detached: function() {
    // 在组件实例被从页面节点树移除时执行
    },
    methods: {
        onGetImageItem(){
            let query = this.createSelectorQuery();
            query.select('#myCanvas').fields({ node: true, size: true }).exec( res =>{
                const canvas = res[0].node
                if (!canvas) return
                // 获取canvas实例
                wx.getImageInfo({
                  src: this.properties.itemData.coverImgUrl,
                  success: imgInfo => {
                    const { path, height, width } = imgInfo;
                    const ctx = canvas.getContext('2d')
                    // 初始化画布大小
                    const dpr = wx.getWindowInfo().pixelRatio
                    canvas.width = width * dpr
                    canvas.height = height * dpr
                    ctx.scale(dpr, dpr)
                    let img = canvas.createImage();
                    img.src = path
                    img.onload = (e) => {
                        ctx.drawImage(img, 0, 0, width, height);
                        const imageData = ctx.getImageData(0, 0, width, height)
                        const mainColor = colorThief(imageData.data).color().get();
                        console.log(mainColor);
                        this.setData({
                            mainColor
                        })
                        this.triggerEvent("bgColor",mainColor)
                    };
                  },
                  fail(err) { console.error(err); }
                })
            });
        }
    }
})
