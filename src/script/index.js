const macos = require('./macos')
const windows = require('./windows')

module.exports = {
  getMacOsCommand() {
    return macos
  },
  getWindowsCommand() {
    return windows
  },
}
