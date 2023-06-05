import { copyText, isWindows, showNotification } from 'utools-api'
import { execPowerShell, execAppleScript } from 'utools-utils/preload'

export function execScript(script: string) {
  try {
    return isWindows() ? execPowerShell(script) : execAppleScript(script, true)
  } catch (err) {
    copyText(err + '')
    showNotification(`已复制错误: ${err}`)
  }
}
