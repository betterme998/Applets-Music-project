// [01:18.86]歌词部分...
// 正则匹配[]需要转意 加上/ 如 /[/], 加上()表示要匹配的值 /[():():()/], \d表示几位  \.是转意
const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
const re = /[A-Za-z]+/
export function parseLyric(lrcString,newlines = false) {
    const lyricInfos = []
    const newline = []
    const lyricLines = lrcString.split("\n")
    for (const lineString of lyricLines) {
        const results = timeReg.exec(lineString)
        if (!results) continue
        // 转成毫秒
        const minute = results[1] * 60 *1000
        const second = results[2] * 1000
        const mSecond = results[3].length === 2 ? results[3] * 10 : results[3] * 1
        const time = minute + second + mSecond
        const text = lineString.replace(timeReg,"")
        const result = text.search(re)
        const lyricItem = text.length >= 18 && result< 0 ? text.replace(/ +/g, ' ').split(" ") : [text]
        lyricInfos.push({time,text})
        newline.push({time,lyricItem})
    }
    return newlines ?  newline : lyricInfos
}
// // [01:18.86]歌词部分...
// // 正则匹配[]需要转意 加上/ 如 /[/], 加上()表示要匹配的值 /[():():()/], \d表示几位  \.是转意
// const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
// const re = /[A-Za-z]+/
// export function parseLyric(lrcString) {
//     const lyricInfos = []
//     const lyricLines = lrcString.split("\n")
//     for (const [lineString] of lyricLines) {
//         const results = timeReg.exec(lineString)
//         if (!results) continue
//         // 转成毫秒
//         const minute = results[1] * 60 *1000
//         const second = results[2] * 1000
//         const mSecond = results[3].length === 2 ? results[3] * 10 : results[3] * 1
//         const time = minute + second + mSecond
//         const text = lineString.replace(timeReg,"")
//         // const result = text.search(re)
//         // const lyricItem = text.length >= 18 && result< 0 ? text.replace(/ +/g, ' ').split(" ") : [text]
//         console.log(text);
//         console.log("41111");
//         lyricInfos.push({time,text})
//     }
//     return lyricInfos
// }

// export function newline(lrcString) {
//     console.log(lrcString);
// }