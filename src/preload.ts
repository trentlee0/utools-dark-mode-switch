import {exec} from "child_process"
import script from "./script"
import storage from './storage'
import {setTimeout, clearTimeout, setInterval, clearInterval} from "timers"
import {Status, storeKey, showList, store, convertStatus} from './store'
import {validTime, nowTime, nowToTargetDiffMillis} from "./util/utils"

function execCommand(command: string) {
  utools.hideMainWindow()
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
    }
    utools.outPlugin()
  })
}

function execCommandNoHidden(command: string) {
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
      if (timer) toStopTimer()
    }
  })
}

const MODE = {
  toDark: () => execCommand(script.switchToDark()),
  toDarkNoHidden: () => execCommandNoHidden(script.switchToDark()),
  toLight: () => execCommand(script.switchToLight()),
  toLightNoHidden: () => execCommandNoHidden(script.switchToLight()),
  switch: () => execCommand(script.switchMode()),
  isDark: () => new Promise<boolean>((resolve, reject) => exec(
      script.getDarkMode(), (error, stdout) =>
          error ? reject(error) : resolve(script.isDarkMode(stdout.trim()))
  ))
}

class Timer {
  timer: NodeJS.Timer
  interval: NodeJS.Timer
  toLightTime: string
  toDarkTime: string

  start(toLightTime: string, toDarkTime: string) {
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.handler()
    this.daemon()
  }

  modeCondition() {
    let now = nowTime()
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
  }

  handler() {
    switch (this.modeCondition()) {
      case 0:
        MODE.isDark().then(dark => {
          if (!dark) return
          MODE.toLightNoHidden()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.handler()
          }, nowToTargetDiffMillis(this.toDarkTime))
        })
        break
      case 1:
        MODE.isDark().then(dark => {
          if (dark) return
          MODE.toDarkNoHidden()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.handler()
          }, nowToTargetDiffMillis(this.toLightTime))
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

function toStartTimer() {
  timer.start(store.toLightTime, store.toDarkTime)
  store.setStatus(Status.ENABLE)
}

function toStopTimer() {
  timer.stop()
  store.setStatus(Status.DISABLE)
}

function toRestartTimer() {
  timer.stop()
  toStartTimer()
}

function initStore() {
  let s = storage.get(storeKey.Status)
  store.setStatus(s !== null ? s : Status.DISABLE)
  store.setToLightTime(storage.get(storeKey.ToLightTime) || '07:00')
  store.setToDarkTime(storage.get(storeKey.ToDarkTime) || '18:00')

  if (store.status === Status.ENABLE) {
    timer.start(store.toLightTime, store.toDarkTime)
  }
}

const timer: Timer = new Timer()
let inputTime: string = ''

if (Reflect.has(utools, 'onPluginReady')) {
  // @ts-ignore
  utools['onPluginReady'](() => initStore())
} else {
  initStore()
}

window.exports = {
  "dark-light": {
    mode: "none",
    args: {
      enter: () => MODE.switch()
    },
  },
  "to-dark": {
    mode: "none",
    args: {
      enter: () => MODE.toDark()
    },
  },
  "to-light": {
    mode: "none",
    args: {
      enter: () => MODE.toLight()
    },
  },
  "switch-setting": {
    mode: "list",
    args: {
      placeholder: "开启后输入时间 (00:00-23:59)，选择模式 -> Enter",
      enter: (action: any, callbackSetList: any) => {
        inputTime = ''
        callbackSetList(showList)
      },
      search: (action: any, searchWord: any, callbackSetList: any) => {
        inputTime = searchWord
        callbackSetList(showList)
      },
      select: (action: any, itemData: any, callbackSetList: any) => {
        if (showList[0] === itemData) {
          if (itemData.description === convertStatus(Status.DISABLE)) toStartTimer()
          else toStopTimer()
        } else if (validTime(inputTime ? inputTime.trim() : "")) {
          if (showList[1] === itemData) {
            store.setToLightTime(inputTime)
          } else if (showList[2] === itemData) {
            store.setToDarkTime(inputTime)
          }
          toRestartTimer()
        }
        callbackSetList(showList)
      }
    }
  }
}
