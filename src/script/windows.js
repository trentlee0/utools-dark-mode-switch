module.exports = () => {
  // PowerShell 。0 为深色模式，1 为浅色模式
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
  return script.replaceAll('\n', '')
}
