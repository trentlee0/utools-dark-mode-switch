const {exec} = require('child_process')
const {setTimeout, clearTimeout, setInterval, clearInterval} = require('timers')

function handleError(err) {
  if (!err) return
  utools.copyText(err.toString())
  utools.showNotification(`已复制错误: ${err}`)
}


window.execCommand = (command) => {
  if (utools.isWindows()) {
    exec(command, {shell: 'powershell.exe'}, handleError)
  } else {
    exec(command, handleError)
  }
}


window.execAsync = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) reject(err)
      else resolve(stdout.trim())
    })
  })
}

window.setTimeout = setTimeout
window.clearTimeout = clearTimeout
window.setInterval = setInterval
window.clearInterval = clearInterval
