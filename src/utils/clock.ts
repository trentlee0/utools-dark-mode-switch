import { formatTime, nowToTargetDiffMillis } from '@/utils/common'
import dark from '@/utils/dark'

enum ModeStatus {
  LIGHT = 0,
  DARK = 1,
  NONE = -1
}

class Clock {
  timer?: number
  interval?: number

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
    return ModeStatus.NONE
  }

  private nextHandler(delay: number) {
    window.clearTimeout(this.timer)
    this.timer = window.setTimeout(() => this.handler(), delay)
  }

  async handler() {
    switch (this.modeCondition()) {
      case ModeStatus.LIGHT:
        if (!(await dark.isLight())) dark.toLight()
        const delayDark = nowToTargetDiffMillis(this.toDarkTime)
        if (import.meta.env.DEV) {
          console.log('next: light to dark --> %dms', delayDark)
        }
        this.nextHandler(delayDark)
        break
      case ModeStatus.DARK:
        if (!(await dark.isDark())) dark.toDark()
        const delayLight = nowToTargetDiffMillis(this.toLightTime)
        if (import.meta.env.DEV) {
          console.log('next: dark to light --> %dms', delayLight)
        }
        this.nextHandler(delayLight)
        break
    }
  }

  stop() {
    window.clearTimeout(this.timer)
    window.clearInterval(this.interval)
  }

  daemon() {
    this.interval = window.setInterval(() => this.handler(), 15 * 1000)
  }
}

export default new Clock()
