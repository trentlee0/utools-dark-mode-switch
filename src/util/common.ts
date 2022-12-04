export function isUTools() {
  if (process.env.NODE_ENV === 'production') return true
  return Reflect.has(window, 'utools')
}

export function stringFill(obj: any, len: number, fill?: any) {
  return obj.toString().padStart(len, fill?.toString())
}

export function formatTime(date: Date) {
  const hh = stringFill(date.getHours(), 2, 0)
  const mm = stringFill(date.getMinutes(), 2, 0)
  return hh + ':' + mm
}

export function diffMillis(source: Date, target: Date) {
  let ans = target.getTime() - source.getTime()
  return ans >= 0 ? ans : 86400000 + ans
}

export function timeToDate(
    hour: number,
    minute: number,
    second: number = 0,
    millis: number = 0
) {
  const d = new Date()
  d.setHours(hour)
  d.setMinutes(minute)
  d.setSeconds(second)
  d.setMilliseconds(millis)
  return d
}

/**
 * @param targetTime hh:mm
 */
export function nowToTargetDiffMillis(targetTime: string) {
  return diffMillis(new Date(), parseTimeToDate(targetTime))
}

/**
 * @param time hh:mm
 */
export function parseTime(time: string) {
  const [hour, minute] = time.split(':')
  return {
    hour: parseInt(hour),
    minute: parseInt(minute)
  }
}

/**
 * @param time hh:mm
 */
export function parseTimeToDate(time: string) {
  let t = parseTime(time)
  return timeToDate(t.hour, t.minute)
}

export function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
