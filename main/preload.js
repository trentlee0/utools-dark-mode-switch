const {exec} = require('child_process');

window.exports = {
  "dark-night": {
    mode: "none",
    args: {
      enter: (action) => {
        window.utools.hideMainWindow();
        let darkLightPS = "$out = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme; [int]$mode = 1; if ($out -as [string] -match '(SystemUsesLightTheme.+0x)(\\d)') {$mode = $Matches[2] -as [int]; }; $mode = -not($mode -as [bool]) -as [int]; reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d $mode /f; reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d $mode /f;";
        exec(`powershell.exe ${darkLightPS}`, (error, stdout, stderr) => {
          if (error) {
            window.utools.showNotification(`执行的错误: ${error}`);
          }
          window.utools.outPlugin();
        });
      }
    }
  }
};
