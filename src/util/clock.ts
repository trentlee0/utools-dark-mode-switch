import {formatTime, nowToTargetDiffMillis} from '@/util/common'
import actions from './actions'

export default {
  timer: <NodeJS.Timeout>{},
  interval: <NodeJS.Timer>{},
  toLightTime: '',
  toDarkTime: '',

  start(toLightTime: string, toDarkTime: string, forceSwitch: boolean) {
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.handler()
    if (forceSwitch) {
      this.daemon()
    }
  },
  continue(forceSwitch: boolean) {
    this.handler()
    if (forceSwitch) {
      this.daemon()
    }
  },
  modeCondition() {
    let now = formatTime(new Date())
    if (this.toDarkTime > this.toLightTime) {
      // light
      if (this.toLightTime <= now && now < this.toDarkTime) return 0
      // dark
      else if (this.toDarkTime <= now || now < this.toLightTime) return 1
    } else if (this.toDarkTime < this.toLightTime) {
      // dark
      if (this.toDarkTime <= now && now < this.toLightTime) return 1
      // light
      else if (this.toLightTime <= now || now < this.toDarkTime) return 0
    }
    return -1
  },
  handler() {
    switch (this.modeCondition()) {
      case 0:
        actions.isDark().then((dark) => {
          if (!dark) return
          actions.toLightNoHidden()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.handler()
          }, nowToTargetDiffMillis(this.toDarkTime))
        })
        break
      case 1:
        actions.isDark().then((dark) => {
          if (dark) return
          actions.toDarkNoHidden()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.handler()
          }, nowToTargetDiffMillis(this.toLightTime))
        })
        break
    }
  },
  stop() {
    clearTimeout(this.timer)
    clearInterval(this.interval)
  },
  daemon() {
    this.interval = setInterval(() => {
      this.handler()
    }, 15 * 1000)
  }
}
