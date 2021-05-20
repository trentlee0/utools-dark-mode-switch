const {exec} = require('child_process');

window.exports = {
  "dark-night": {
    mode: "none",
    args: {
      enter: (action) => {
        window.utools.hideMainWindow();
        let darkLightPS = '$out = reg.exe query HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme; $outStr = $out -as [string]; if ($outStr -match \'(SystemUsesLightTheme.+0x)(\\d)\') {$mode = $Matches[2] } else {$mode = 1 }; if ($mode -as [int] -eq 1) {$night = 0 } else {$night = 1 }; reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v AppsUseLightTheme /t REG_DWORD /d $night /f; reg.exe add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v SystemUsesLightTheme /t REG_DWORD /d $night /f;';
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
