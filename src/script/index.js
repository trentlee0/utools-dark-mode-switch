const macos = require('./macos')
const windows = require('./windows')

module.exports = () => {
  if (utools.isWindows()) {
    return windows
  } else if (utools.isMacOs()) {
    return macos
  }
}
