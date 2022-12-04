import {Mode, Script} from './base'

function powershellCommand(script: string) {
  return `powershell.exe ${script.replace(/\n/g, '')}`
}

export class WindowsScript extends Script {
  protected switchScript(): string {
    const script = `
      $temp = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme;
      [int]$mode = 1;
      if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
      {
          $mode = $Matches[2] -as [int];
      };
      $mode = -not($mode -as [bool]) -as [int];
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d $mode /f;
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d $mode /f;`
    return powershellCommand(script)
  }

  protected switchToScript(mode: Mode): string {
    const c = mode === Mode.DARK ? 0 : 1
    const script = `
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d ${c} /f;
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d ${c} /f;`
    return powershellCommand(script)
  }

  protected getDarkScript(): string {
    const script = `
      $temp = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme;
      [int]$mode = 1;
      if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
      {
        $mode = $Matches[2] -as [int];
      };
      $mode`
    return powershellCommand(script)
  }

  protected isDarkMode(scriptResult: string): boolean {
    return scriptResult === '0'
  }
}
