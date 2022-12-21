import {Mode, Script} from './common'

function execAppleScript(script: string) {
  execCommand(`osascript -e '${script}'`)
}

export class MacOsScript extends Script {
  private commonScript(script: string) {
    return `
      tell application "System Events"
          tell appearance preferences
              ${script}
          end tell
      end tell`
  }

  toOther(): void {
    execAppleScript(this.commonScript(`set dark mode to not dark mode`))
  }

  toMode(mode: Mode): void {
    execAppleScript(this.commonScript(`set dark mode to ${mode === Mode.DARK}`))
  }

  isDark(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      execAsync(this.commonScript(`get dark mode`)).then((res) =>
        resolve(res === 'true')
      )
    })
  }
}
