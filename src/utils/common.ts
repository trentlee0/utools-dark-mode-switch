export function formatTime(time: Date) {
  const fillZero = (num: number) => num.toString().padStart(2, '0')
  return `${fillZero(time.getHours())}:${fillZero(time.getMinutes())}`
}

export function diffMillis(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime()
  const day = 86400000
  return (diff + day) % day
}

/**
 * @param targetTime HH:mm
 */
export function nowToTargetDiffMillis(targetTime: string): number {
  return diffMillis(new Date(), parseTime(targetTime))
}

function newTime(
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
 * @param time HH:mm
 */
export function parseTime(time: string): Date {
  const [hour, minute] = time.split(':')
  return newTime(parseInt(hour), parseInt(minute))
}
