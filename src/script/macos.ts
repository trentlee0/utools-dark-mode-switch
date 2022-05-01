import {Mode, Script} from "./index";

export class MacOsScript implements Script {
  getDarkMode(): string {
    const script = `
      tell application "System Events"
        tell appearance preferences
            get dark mode
        end tell
      end tell
      `
    return `osascript -e '${script}'`
  }

  switchMode(): string {
    const script = `
      tell application "System Events"
        tell appearance preferences
            set dark mode to not dark mode
        end tell
      end tell
      `
    return `osascript -e '${script}'`
  }

  switchTo(mode: Mode): string {
    let c
    switch (mode) {
      case Mode.DARK:
        c = true
        break
      case Mode.LIGHT:
        c = false
        break
    }
    const script = `
      tell application "System Events"
        tell appearance preferences
            set dark mode to ${c}
        end tell
      end tell
      `
    return `osascript -e '${script}'`
  }

  isDarkMode(scriptResult: string): boolean {
    return scriptResult === 'true'
  }

  switchToDark(): string {
    return this.switchTo(Mode.DARK)
  }

  switchToLight(): string {
    return this.switchTo(Mode.LIGHT)
  }
}
