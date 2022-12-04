import {Mode, Script} from './base'

function appleScriptCommand(script: string) {
  return `osascript -e '${script}'`
}

export class MacOsScript extends Script {
  protected switchScript(): string {
    const script = `
      tell application "System Events"
          tell appearance preferences
              set dark mode to not dark mode
          end tell
      end tell`
    return appleScriptCommand(script)
  }

  protected switchToScript(mode: Mode): string {
    const script = `
      tell application "System Events"
          tell appearance preferences
              set dark mode to ${mode === Mode.DARK}
          end tell
      end tell`
    return appleScriptCommand(script)
  }

  protected getDarkScript(): string {
    const script = `
      tell application "System Events"
          tell appearance preferences
              get dark mode
          end tell
      end tell`
    return appleScriptCommand(script)
  }

  protected isDarkMode(scriptResult: string): boolean {
    return scriptResult === 'true'
  }
}
