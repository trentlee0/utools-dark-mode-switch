import { createPinia, defineStore } from 'pinia'
import { toRaw } from 'vue'
import clock from '@/utils/clock'
import { getSuntime } from '@/utils/suntime'
import { StoreKey, Status } from '@/constant'
import { SettingModel } from '@/models/SettingModel'
import { CoordinateModel } from '@/models/CoordinateModel'
import { storage } from 'utools-utils'

function startClock(setting: SettingModel) {
  clock.stop()
  clock.start(setting.toLightTime, setting.toDarkTime, setting.forceSwitch)
}

function startCoordinateClock(setting: SettingModel) {
  const { latitude, longitude } = setting.coordinate
  const { sunrise, sunset } = getSuntime(latitude, longitude)
  startClock({ ...setting, toLightTime: sunrise, toDarkTime: sunset })
}

export const useStore = defineStore('main', {
  state: () => {
    const setting = storage.sync.get(StoreKey.SETTING, SettingModel.DEFAULT)
    if (SettingModel.migrateDatabase(setting)) {
      storage.sync.set(StoreKey.SETTING, setting)
      console.log('database migrated:', setting)
    }

    switch (setting.status) {
      case Status.AUTO_TIME:
        startClock(setting)
        break
      case Status.COORDINATE:
        startCoordinateClock(setting)
        break
    }

    return setting
  },
  actions: {
    persist() {
      storage.sync.set(StoreKey.SETTING, toRaw(this.$state))
    },
    setStatus(status: Status) {
      this.status = status
      this.persist()

      switch (this.status) {
        case Status.DISABLE:
          clock.stop()
          break
        case Status.AUTO_TIME:
          startClock(this.$state)
          break
        case Status.COORDINATE:
          startCoordinateClock(this.$state)
          break
      }
    },
    setToLightTime(toLightTime: string) {
      this.toLightTime = toLightTime
      this.persist()

      startClock({ ...this, toLightTime })
    },
    setToDarkTime(toDarkTime: string) {
      this.toDarkTime = toDarkTime
      this.persist()

      startClock({ ...this, toDarkTime })
    },
    setCoordinate(coordinate: CoordinateModel) {
      this.coordinate = coordinate
      this.persist()

      startCoordinateClock({ ...this, coordinate })
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
