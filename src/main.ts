import { createApp } from 'vue'
import pinia from '@/store'
import App from './App.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import dark from '@/utils/dark'
import { FeatureCode } from '@/constant'
import { hideMainWindow, onPluginEnter, outPlugin } from 'utools-api'

createApp(App).use(pinia).mount('#app')

onPluginEnter(({ code }) => {
  if (code === FeatureCode.SETTING) return

  hideMainWindow()
  outPlugin()
  switch (code) {
    case FeatureCode.DARK_LIGHT:
      dark.toOther()
      break
    case FeatureCode.TO_DARK:
      dark.toDark()
      break
    case FeatureCode.TO_LIGHT:
      dark.toLight()
      break
  }
})
