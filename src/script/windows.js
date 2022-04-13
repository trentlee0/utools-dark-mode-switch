/* PowerShell */

function getCommand(script) {
  return `powershell.exe ${script}`
}

function switchScript() {
  let script = `
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
  return script.replace(/\n/g, '')
}

function switchToScript(mode) {
  let script = `
    reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d ${mode} /f;
    reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d ${mode} /f;
    `
  return script.replace(/\n/g, '')
}

function getDarkMode() {
  let script = `
    $temp = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme;
    [int]$mode = 1;
    if ($temp -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)')
    {
      $mode = $Matches[2] -as [int];
    };
    $mode
    `
  return script.replace(/\n/g, '')
}

module.exports = {
  switchCommand() {
    return getCommand(switchScript())
  },
  switchToDarkCommand() {
    return getCommand(switchToScript(0))
  },
  switchToLightCommand() {
    return getCommand(switchToScript(1))
  },
  getDarkModeCommand() {
    return getCommand(getDarkMode())
  },
  isDarkMode(mode) {
    return mode === '0'
  }
}
