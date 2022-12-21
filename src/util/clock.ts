import {formatTime, nowToTargetDiffMillis} from '@/util/common'
import script from '@/script'

enum ModeStatus {
  LIGHT = 0,
  DARK = 1,
  NO = -1
}

class Clock {
  timer: any
  interval: any
  toLightTime: string
  toDarkTime: string

  constructor() {
    this.toLightTime = ''
    this.toDarkTime = ''
  }

  start(toLightTime: string, toDarkTime: string, forceSwitch: boolean) {
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.handler()
    if (forceSwitch) {
      this.daemon()
    }
  }

  continue(forceSwitch: boolean) {
    this.handler()
    if (forceSwitch) {
      this.daemon()
    }
  }

  modeCondition() {
    const now = formatTime(new Date())
    if (this.toDarkTime > this.toLightTime) {
      if (this.toLightTime <= now && now < this.toDarkTime)
        return ModeStatus.LIGHT
      else if (this.toDarkTime <= now || now < this.toLightTime)
        return ModeStatus.DARK
    } else if (this.toDarkTime < this.toLightTime) {
      if (this.toDarkTime <= now && now < this.toLightTime)
        return ModeStatus.DARK
      else if (this.toLightTime <= now || now < this.toDarkTime)
        return ModeStatus.LIGHT
    }
    return ModeStatus.NO
  }

  handler() {
    switch (this.modeCondition()) {
      case ModeStatus.LIGHT:
        console.log('light -->', nowToTargetDiffMillis(this.toDarkTime))
        script.isDark().then((dark) => {
          if (!dark) return

          script.toLight()
          clearTimeout(this.timer)
          this.timer = setTimeout(
            () => this.handler(),
            nowToTargetDiffMillis(this.toDarkTime)
          )
        })
        break
      case ModeStatus.DARK:
        console.log('dark -->', nowToTargetDiffMillis(this.toLightTime))
        script.isDark().then((dark) => {
          if (dark) return

          script.toDark()
          clearTimeout(this.timer)
          this.timer = setTimeout(
            () => this.handler(),
            nowToTargetDiffMillis(this.toLightTime)
          )
        })
        break
    }
  }

  stop() {
    clearTimeout(this.timer)
    clearInterval(this.interval)
  }

  daemon() {
    this.interval = setInterval(() => {
      this.handler()
    }, 15 * 1000)
  }
}

export default new Clock()
