// 防抖
export function debounce(fn, delay, immediate = false) {
    // 1.用于记录上一次触发timer
    let timer = null
    let isInvoke = false

    // 2.触发事件时执行的函数
    const _debounce = function (...args) {
        // 返回promise 防抖函数获取返回值
        return new Promise((resolve, reject) => {
            try {
                // 2.1.如果有再次触发就取消上一次的事件
                if (timer) clearTimeout(timer)

                // 第一次操作是不需要延迟的
                let res = undefined
                if (immediate && !isInvoke) {
                    res = fn.apply(this, args)
                    resolve(res)
                    isInvoke = true
                    return
                }

                timer = setTimeout(() => {
                    res = fn.apply(this, args)
                    resolve(res)
                    timer = null //执行过函数之后，将timer重置null
                    isInvoke = false
                }, delay)
            } catch (error) {
                reject(error)
            }
        })
    }
    // 3.给_debounce绑定一个取消函数
    _debounce.cancel = function() {
        if (timer) clearTimeout(timer)
        timer = null
        isInvoke = false
    }

    // 返回一个新函数
    return _debounce
}