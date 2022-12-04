const {exec} = require('child_process')
const {setTimeout, clearTimeout, setInterval, clearInterval} = require('timers')

window.execCommand = (command) => {
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
    }
  })
}

window.execAsync = (command) => {
  exec(command, (err, stdout) => (err ? reject(err) : resolve(stdout.trim())))
}

window.setTimeout = setTimeout
window.clearTimeout = clearTimeout
window.setInterval = setInterval
window.clearInterval = clearInterval
