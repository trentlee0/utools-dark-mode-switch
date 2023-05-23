import { createPinia, defineStore } from 'pinia'
import { toRaw } from 'vue'
import clock from '@/utils/clock'
import { getSuntime } from '@/utils/suntime'
import { StoreKey, Status } from '@/constant'
import { SettingModel } from '@/models/SettingModel'
import { CoordinateModel } from '@/models/CoordinateModel'
import { sync } from 'utools-utils/storage'

export const useStore = defineStore('main', {
  state: () => {
    const setting = sync.getOrDefault(StoreKey.SETTING, SettingModel.DEFAULT)
    if (SettingModel.migrateDatabase(setting)) {
      sync.set(StoreKey.SETTING, setting)
      console.log('database migrated:', setting)
    }

    switch (setting.status) {
      case Status.AUTO_TIME:
        const { toLightTime, toDarkTime } = setting
        clock.start(toLightTime, toDarkTime, setting.forceSwitch)
        break
      case Status.COORDINATE:
        const { latitude, longitude } = setting.coordinate
        const { sunrise, sunset } = getSuntime(latitude, longitude)
        clock.start(sunrise, sunset, setting.forceSwitch)
        break
    }

    return setting
  },
  actions: {
    persist() {
      sync.set(StoreKey.SETTING, toRaw(this.$state))
    },
    setStatus(status: Status) {
      this.status = status
      this.persist()

      if (this.status === Status.DISABLE) {
        clock.stop()
      }
    },
    setToLightTime(toLightTime: string) {
      this.toLightTime = toLightTime
      this.persist()

      clock.stop()
      clock.start(toLightTime, this.toDarkTime, this.forceSwitch)
    },
    setToDarkTime(toDarkTime: string) {
      this.toDarkTime = toDarkTime
      this.persist()

      clock.stop()
      clock.start(this.toLightTime, toDarkTime, this.forceSwitch)
    },
    setCoordinate(coordinate: CoordinateModel) {
      this.coordinate = coordinate
      this.persist()

      clock.stop()
      const sunjs = getSuntime(coordinate.latitude, coordinate.longitude)
      clock.start(sunjs.sunrise, sunjs.sunset, this.forceSwitch)
    },
    setForceSwitch(forceSwitch: boolean) {
      this.forceSwitch = forceSwitch
      this.persist()

      clock.stop()
      clock.continue(forceSwitch)
    }
  }
})

const pinia = createPinia()
export default pinia
