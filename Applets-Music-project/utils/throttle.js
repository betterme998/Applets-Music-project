// 节流
/*
hythrottle :
该函数实现了一个带可选初始执行和尾部执行的节流函
1.接收目标函数 fn 和最小执行间隔 interval(默认10毫秒)及配置对象。
2.通过计算当前时间和上次执行时间差，控制 fn 的执行频率。
3.如果满足条件，直接执行fn;否则，根据trailing 参数决定是否用 setTimeout 延迟执行。
4.提供 cancel方法取消任何挂起的执行

*/
export default function hythrottle(
  fn,
  interval = 10,
  { leading = true, trailing = false } = {}
) {
  let startTime = 0;
  let timer = null;

  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      try {
        // 1.获取当前时间
        const nowTime = new Date().getTime();

        // 对立即执行进行控制
        if (!leading && startTime === 0) {
          startTime = nowTime;
        }
        // 2.计算需要等待的时间执行函数
        const waitTime = interval - (nowTime - startTime);
        if (waitTime <= 0) {
          // 执行操作fn
          if (timer) clearTimeout(timer);
          const res = fn.apply(this, args);
          resolve(res);
          startTime = nowTime;
          timer = null;
          return;
        }
        // 3.判断是否要执行尾部
        if (trailing && !timer) {
          timer = setTimeout(() => {
            // 执行timer
            const res = fn.apply(this, args);
            resolve(res);
            startTime = new Date().getTime();
            timer = null;
          }, waitTime);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    startTime = 0;
    timer = null;
  };
  return _throttle;
}
