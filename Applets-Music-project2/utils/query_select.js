export default function querySelect(selector) {
    return new Promise(resolve => {
        // 获取Image组件的高度
        const query = wx.createSelectorQuery()
        // 获取组件，然后拿到矩形框
        query.select(selector).boundingClientRect()
        // 执行返回结果
        query.exec((res) => {
            resolve(res)
        })
    })
}