import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import {isUTools} from '@/util/common'
import actions from '@/util/actions'
import {Setting, Status, StoreKey} from '@/store'
import clock from '@/util/clock'
import storage from '@/util/storage'
import {getSuntime} from '@/util/suntime'

import 'element-plus/theme-chalk/dark/css-vars.css'

let app: any

function initApp() {
  if (app) return
  const pinia = createPinia()
  app = createApp(App)
  app.use(pinia)
  app.mount('#app')
}

if (isUTools()) {
  function migrate(setting: Setting) {
    const status = storage.get('status')
    if (!status) return
    const toDarkTime = storage.get('toDarkTime')
    const toLightTime = storage.get('toLightTime')
    if (status) {
      switch (status) {
        case '关闭':
          setting.status = 0
          break
        case '开启':
          setting.status = 1
          break
      }
      storage.remove('status')
    }
    if (toDarkTime) {
      setting.toDarkTime = toDarkTime
      storage.remove('toDarkTime')
    }
    if (toLightTime) {
      setting.toLightTime = toLightTime
      storage.remove('toLightTime')
    }
    if (status || toDarkTime || toLightTime) storage.set(StoreKey.SETTING, setting)
  }

  const setting: Setting = storage.get(StoreKey.SETTING) ?? new Setting()
  migrate(setting)
  switch (setting.status) {
    case Status.AUTO_TIME:
      clock.start(setting.toLightTime, setting.toDarkTime, setting.forceSwitch)
      break
    case Status.COORDINATE:
      const {latitude, longitude} = setting.coordinate
      const suntime = getSuntime(latitude, longitude)
      clock.start(suntime.sunrise, suntime.sunset, setting.forceSwitch)
      break
  }

  function before() {
    utools.hideMainWindow()
    utools.outPlugin()
  }

  utools.onPluginEnter(({code}) => {
    switch (code) {
      case 'dark-light':
        before()
        actions.switch()
        break
      case 'to-dark':
        before()
        actions.toDark()
        break
      case 'to-light':
        before()
        actions.toLight()
        break
      case 'setting':
        initApp()
    }
  })
} else {
  initApp()
}
