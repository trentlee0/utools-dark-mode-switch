/* AppleScript */

function getCommand(script) {
  return `osascript -e '${script}'`
}

function switchScript() {
  return `
    tell application "System Events"
      tell appearance preferences
          set dark mode to not dark mode
      end tell
    end tell
    `
}

function switchToScript(mode) {
  return `
    tell application "System Events"
      tell appearance preferences
          set dark mode to ${mode}
      end tell
    end tell
    `
}

function getDarkMode() {
  return `
    tell application "System Events"
      tell appearance preferences
          get dark mode
      end tell
    end tell
    `
}

module.exports = {
  switchCommand() {
    return getCommand(switchScript())
  },
  switchToDarkCommand() {
    return getCommand(switchToScript(true))
  },
  switchToLightCommand() {
    return getCommand(switchToScript(false))
  },
  getDarkModeCommand() {
    return getCommand(getDarkMode())
  },
  isDarkMode(mode) {
    return mode === 'true'
  }
}
