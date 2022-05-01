import {Mode, Script} from "./index";

export class WindowsScript implements Script {
  switchMode(): string {
    const script = `
      $temp = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme;
      [int]$mode = 1;
      if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
      {
          $mode = $Matches[2] -as [int];
      };
      $mode = -not($mode -as [bool]) -as [int];
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d $mode /f;
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d $mode /f;
      `
    return 'powershell.exe ' + script.replace(/\n/g, '')
  }

  switchTo(mode: Mode): string {
    let c
    switch (mode) {
      case Mode.DARK:
        c = 0
        break
      case Mode.LIGHT:
        c = 1
        break
    }
    const script = `
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d ${c} /f;
      reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d ${c} /f;
      `
    return 'powershell.exe ' + script.replace(/\n/g, '')
  }

  getDarkMode(): string {
    const script = `
      $temp = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme;
      [int]$mode = 1;
      if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
      {
        $mode = $Matches[2] -as [int];
      };
      $mode
      `
    return 'powershell.exe ' + script.replace(/\n/g, '')
  }

  isDarkMode(scriptResult: string): boolean {
    return scriptResult === '0';
  }

  switchToDark(): string {
    return this.switchTo(Mode.DARK)
  }

  switchToLight(): string {
    return this.switchTo(Mode.LIGHT)
  }
}
