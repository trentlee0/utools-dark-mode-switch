import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

import {isUTools} from '@/util/common'
import actions from '@/util/actions'
import {FeatureCode} from '@/constant'

import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/css-vars.css'


createApp(App).use(createPinia()).mount('#app')

if (isUTools()) {
  function beforeExecute() {
    utools.hideMainWindow()
    utools.outPlugin()
  }

  utools.onPluginEnter(({code}) => {
    switch (code) {
      case FeatureCode.DARK_LIGHT:
        beforeExecute()
        actions.switch()
        break
      case FeatureCode.TO_DARK:
        beforeExecute()
        actions.toDark()
        break
      case FeatureCode.TO_LIGHT:
        beforeExecute()
        actions.toLight()
        break
    }
  })
}
