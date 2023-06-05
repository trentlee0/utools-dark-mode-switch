import { createApp } from 'vue'
import pinia from '@/store'
import App from './App.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import dark from '@/utils/dark'
import { FeatureCode } from '@/constant'
import { onPluginEnter } from 'utools-api'
import { hideAndOutPlugin } from 'utools-utils'

createApp(App).use(pinia).mount('#app')

onPluginEnter(({ code }) => {
  if (code === FeatureCode.SETTING) return

  hideAndOutPlugin()
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
