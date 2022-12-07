import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

import {isUTools} from '@/util/common'
import script from '@/script'
import {FeatureCode} from '@/constant'

import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/css-vars.css'

if (isUTools()) {
  function beforeExecute() {
    utools.hideMainWindow()
    utools.outPlugin()
  }

  utools.onPluginEnter(({code}) => {
    if (code === FeatureCode.SETTING) return

    beforeExecute()
    switch (code) {
      case FeatureCode.DARK_LIGHT:
        script.toOther()
        break
      case FeatureCode.TO_DARK:
        script.toDark()
        break
      case FeatureCode.TO_LIGHT:
        script.toLight()
        break
    }
  })
} else {
  // @ts-ignore
  window.execCommand = (command: string) => {
    console.warn(`preload.js ==> execCommand('${command}')`)
  }
  // @ts-ignore
  window.execAsync = (command): Promise<string> => {
    console.warn(`preload.js ==> execAsync('${command}')`)
    return new Promise<string>((resolve) => resolve(''))
  }
}

createApp(App).use(createPinia()).mount('#app')
