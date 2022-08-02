import script from '@/script'

function execCommand(command: string) {
  exec(command, (err) => {
    if (err) {
      utools.showNotification(`错误: ${err}`)
    }
  })
}

const modeActions = {
  toDark() {
    execCommand(script.switchToDark())
  },
  toDarkNoHidden() {
    execCommand(script.switchToDark())
  },
  toLight() {
    execCommand(script.switchToLight())
  },
  toLightNoHidden() {
    execCommand(script.switchToLight())
  },
  switch() {
    execCommand(script.switchMode())
  },
  isDark() {
    return new Promise<boolean>((resolve, reject) =>
      exec(script.getDarkMode(), (err, stdout) =>
        err ? reject(err) : resolve(script.isDarkMode(stdout.trim()))
      )
    )
  }
}

export default modeActions
