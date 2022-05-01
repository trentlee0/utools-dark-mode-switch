export function fill2Zero(num: number) {
  return num.toString().padStart(2, '0')
}

export function nowTime() {
  let date = new Date()
  return `${fill2Zero(date.getHours())}:${fill2Zero(date.getMinutes())}`
}

export function validTime(time: string) {
  return /^(20|21|22|23|[0-1]\d):[0-5]\d$/.test(time)
}

export function nowToTargetDiffMillis(targetTime: string) {
  let arr = targetTime.split(':')
  let target = new Date()
  target.setHours(parseInt(arr[0]))
  target.setMinutes(parseInt(arr[1]))
  target.setSeconds(0)
  let ans = target.getTime() - new Date().getTime()
  return ans >= 0 ? ans : 86400000 + ans
}
