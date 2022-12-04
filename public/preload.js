const {exec} = require('child_process')
const {setTimeout, clearTimeout, setInterval, clearInterval} = require('timers')

window.execCommand = (command) => {
  exec(command, (err) => {
    if (err) {
      utools.copyText(err.toString())
      utools.showNotification(`已复制错误: ${err}`)
    }
  })
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
