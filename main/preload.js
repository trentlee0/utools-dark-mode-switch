const {exec} = require('child_process');

window.exports = {
  "dark-night": {
    mode: "none",
    args: {
      enter: (action) => {
        window.utools.hideMainWindow();
        exec(`lib/Dark-Light.ps1`, {
          shell: 'powershell.exe',
          cwd: __dirname
        }, (error, stdout, stderr) => {
          if (error) {
            window.utools.showNotification(`执行的错误: ${error}`);
          }
          window.utools.outPlugin();
        });
      }
    }
  }
};
