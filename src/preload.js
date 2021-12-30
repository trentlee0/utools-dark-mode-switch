const {exec} = require('child_process')
const macosScript = require('./script/macos')
const windowsScript = require('./script/windows')

let switchScript
if (utools.isWindows()) {
  switchScript = `powershell.exe ${windowsScript()}`
} else if (utools.isMacOs()) {
  switchScript = `osascript -e '${macosScript()}'`
}

window.exports = {
  "dark-night": {
    mode: "none",
    args: {
      enter: (action) => {
        utools.hideMainWindow()
        exec(switchScript, (err) => {
          if (err) {
            utools.showNotification(`错误: ${err}`)
          }
          utools.outPlugin()
        })
      }
    }
  }
}
