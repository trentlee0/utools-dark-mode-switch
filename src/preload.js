const {exec} = require("child_process")
const script = require("./script")
const storage = require('./storage')
const {status, storeKey, list, store} = require('./store')

const platform = script()

const MODE = {
  toDark: () => execCommand(platform.switchToDarkCommand()),
  toDarkNoHidden: () => execCommandNoHidden(platform.switchToDarkCommand()),
  toLight: () => execCommand(platform.switchToLightCommand()),
  toLightNoHidden: () => execCommandNoHidden(platform.switchToLightCommand()),
  switch: () => execCommand(platform.switchCommand()),
  isDark: () => new Promise((resolve, reject) => exec(
    platform.getDarkModeCommand(), (error, stdout) =>
      error ? reject(error) : resolve(platform.isDarkMode(stdout.trim()))
  ))
}

class Timer {
  timer
  toLightTime
  toDarkTime

  start(toLightTime, toDarkTime) {
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.handler()
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
        MODE.toLightNoHidden()
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.handler()
        }, nowToTargetDiffMillis(this.toDarkTime))
        break
      case 1:
        MODE.toDarkNoHidden()
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.handler()
        }, nowToTargetDiffMillis(this.toLightTime))
        break
    }
  }

  stop() {
    clearTimeout(this.timer)
  }
}

function nowToTargetDiffMillis(targetTime) {
  let arr = targetTime.split(':')
  let target = new Date()
  target.setHours(parseInt(arr[0]))
  target.setMinutes(parseInt(arr[1]))
  target.setSeconds(0)
  let ans = target - new Date()
  return ans >= 0 ? ans : 86400000 + ans
}

function execCommand(command) {
  utools.hideMainWindow()
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
    }
    utools.outPlugin()
  })
}

function execCommandNoHidden(command) {
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
      if (timer) toStopTimer()
    }
  })
}

function fill2Zero(num) {
  return num.toString().padStart(2, '0')
}

function nowTime() {
  let date = new Date()
  return `${fill2Zero(date.getHours())}:${fill2Zero(date.getMinutes())}`
}

function validTime(time) {
  return /^(20|21|22|23|[0-1]\d):[0-5]\d$/.test(time)
}

function toStartTimer() {
  timer.start(store.toLightTime, store.toDarkTime)
  store.setStatus(status.Enable)
}

function toStopTimer() {
  timer.stop()
  store.setStatus(status.Disable)
}

function toRestartTimer() {
  timer.stop()
  toStartTimer()
}

function initStore() {
  store.setStatus(storage.get(storeKey.Status) || status.Disable)
  store.setToLightTime(storage.get(storeKey.ToLightTime) || '07:00')
  store.setToDarkTime(storage.get(storeKey.ToDarkTime) || '18:00')

  if (store.status === status.Enable) {
    timer.start(store.toLightTime, store.toDarkTime)
  }
}

const timer = new Timer()
let inputTime = ''

Reflect.has(utools, 'onPluginReady') ? utools['onPluginReady'](() => initStore()) : initStore()

window.exports = {
  "dark-light": {
    mode: "none",
    args: {
      enter: (action) => MODE.switch()
    },
  },
  "to-dark": {
    mode: "none",
    args: {
      enter: (action) => MODE.toDark()
    },
  },
  "to-light": {
    mode: "none",
    args: {
      enter: (action) => MODE.toLight()
    },
  },
  "switch-setting": {
    mode: "list",
    args: {
      placeholder: "开启后输入时间 (00:00-23:59)，选择模式 -> Enter",
      enter: (action, callbackSetList) => {
        callbackSetList(list)
      },
      search: (action, searchWord, callbackSetList) => {
        inputTime = searchWord
        callbackSetList(list)
      },
      select: (action, itemData, callbackSetList) => {
        if (list[0] === itemData) {
          if (itemData.description === status.Disable) toStartTimer()
          else toStopTimer()
        } else if (validTime(inputTime ? inputTime.trim() : "")) {
          if (list[1] === itemData) {
            store.setToLightTime(inputTime)
          } else if (list[2] === itemData) {
            store.setToDarkTime(inputTime)
          }
          toRestartTimer()
        }
        callbackSetList(list)
      }
    }
  }
}
