import { execScript } from '@/preload'
import { isWindows } from 'utools-api'

export enum Mode {
  DARK,
  LIGHT
}

export abstract class Script {
  abstract toOther(): void

  abstract toMode(mode: Mode): void

  toDark(): void {
    this.toMode(Mode.DARK)
  }

  toLight(): void {
    this.toMode(Mode.LIGHT)
  }

  abstract isDark(): Promise<boolean>

  abstract isLight(): Promise<boolean>
}

class WindowsScript extends Script {
  private convertValue(mode: Mode): 0 | 1 {
    return mode === Mode.DARK ? 0 : 1
  }

  private isDarkScript() {
    const script = `
      $temp = reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme
      [int]$mode = ${this.convertValue(Mode.LIGHT)}
      if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
      {
        $mode = $Matches[2] -as [int]
      }
      $mode`
    return script
  }

  toOther(): void {
    const script = `
      ${this.isDarkScript()} = -not($mode -as [bool]) -as [int]
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d $mode /f
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d $mode /f`
    execScript(script)
  }

  toMode(mode: Mode): void {
    const c = this.convertValue(mode)
    const script = `
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d ${c} /f
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d ${c} /f`
    execScript(script)
  }

  private async getDarkLight() {
    return (await execScript(this.isDarkScript()))?.stdout.trim()
  }

  async isDark() {
    return (await this.getDarkLight()) === '0'
  }

  async isLight() {
    return (await this.getDarkLight()) === '1'
  }
}

class MacOsScript extends Script {
  private commonScript(script: string) {
    return `
      tell application "System Events"
          tell appearance preferences
              ${script}
          end tell
      end tell`
  }

  toOther(): void {
    execScript(this.commonScript(`set dark mode to not dark mode`))
  }

  toMode(mode: Mode): void {
    execScript(this.commonScript(`set dark mode to ${mode === Mode.DARK}`))
  }

  private async getDarkLight() {
    return (await execScript(this.commonScript(`get dark mode`)))?.stdout.trim()
  }

  async isDark() {
    return (await this.getDarkLight()) === 'true'
  }

  async isLight() {
    return (await this.getDarkLight()) === 'false'
  }
}

export default isWindows() ? new WindowsScript() : new MacOsScript()
