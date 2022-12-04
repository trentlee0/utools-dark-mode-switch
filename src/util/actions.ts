import script from '@/script'

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
    return new Promise<boolean>((resolve, reject) => {
      execAsync(script.getDarkMode())
        .then((stdout) => resolve(script.isDarkMode(stdout)))
        .catch(reject)
    })
  }
}

export default modeActions
