import {Mode, Script} from './common'

export class WindowsScript extends Script {
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
    execCommand(script)
  }

  toMode(mode: Mode): void {
    const c = this.convertValue(mode)
    const script = `
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d ${c} /f
      reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d ${c} /f`
    execCommand(script)
  }

  isDark(): Promise<boolean> {
    return new Promise((resolve) => {
      execAsync(this.isDarkScript()).then((res) => resolve(res === '0'))
    })
  }
}
