const {exec} = require("child_process")
const script = require("./script")

const MODE = {DARK: 1, LIGHT: -1, NONE: 0}

let platform
if (utools.isWindows()) {
  platform = script.getWindowsCommand()
} else if (utools.isMacOs()) {
  platform = script.getMacOsCommand()
}

function switchMode(mode = MODE.NONE) {
  let command
  if (mode === MODE.DARK) {
    command = platform.switchToDarkCommand()
  } else if (mode === MODE.LIGHT) {
    command = platform.switchToLightCommand()
  } else {
    command = platform.switchCommand()
  }

  utools.hideMainWindow()
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
    }
    utools.outPlugin()
  })
}

window.exports = {
  "dark-light": {
    mode: "none",
    args: {
      enter: (action) => {
        switchMode(MODE.NONE)
      },
    },
  },
  "to-dark": {
    mode: "none",
    args: {
      enter: (action) => {
        switchMode(MODE.DARK)
      },
    },
  },
  "to-light": {
    mode: "none",
    args: {
      enter: (action) => {
        switchMode(MODE.LIGHT)
      },
    },
  },
}
