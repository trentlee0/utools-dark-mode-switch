const {exec} = require('child_process')
const {setTimeout, clearTimeout, setInterval, clearInterval} = require('timers')

window.exec = exec
window.setTimeout = setTimeout
window.clearTimeout = clearTimeout
window.setInterval = setInterval
window.clearInterval = clearInterval
