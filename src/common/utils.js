export function transformTimer(time) {
    // time 为时间戳
    const data = new Date(time);
    let y = data.getFullYear();
    let M = data.getMonth();
    let d = data.getDate();
    let h = data.getHours();
    let m = data.getMinutes();
    let s = data.getSeconds();
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
}