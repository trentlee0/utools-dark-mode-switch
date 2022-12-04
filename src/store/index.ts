import storage from '@/util/storage'
import {defineStore} from 'pinia'
import clock from '@/util/clock'
import {getSuntime} from '@/util/suntime'
import {deepCopy} from '@/util/common'
import {StoreKey, Status} from '@/constant'
import {SettingModel} from '@/models/SettingModel'
import {CoordinateModel} from '@/models/CoordinateModel'

function migrate(setting: SettingModel) {
  const status = storage.get(StoreKey.STATUS)
  if (!status) return
  const toDarkTime = storage.get<string>(StoreKey.TO_DARK_TIME)
  const toLightTime = storage.get<string>(StoreKey.TO_LIGHT_TIME)
  if (status) {
    switch (status) {
      case '关闭':
        setting.status = Status.DISABLE
        break
      case '开启':
        setting.status = Status.AUTO_TIME
        break
    }
    storage.remove(StoreKey.STATUS)
  }
  if (toDarkTime) {
    setting.toDarkTime = toDarkTime
    storage.remove(StoreKey.TO_DARK_TIME)
  }
  if (toLightTime) {
    setting.toLightTime = toLightTime
    storage.remove(StoreKey.TO_LIGHT_TIME)
  }
  if (status || toDarkTime || toLightTime)
    storage.set(StoreKey.SETTING, setting)
}

export const useStore = defineStore('main', {
  state: () => {
    const setting = storage.getOrDefault(StoreKey.SETTING, SettingModel.DEFAULT)
    migrate(setting)
    switch (setting.status) {
      case Status.AUTO_TIME:
        const {toLightTime, toDarkTime, forceSwitch} = setting
        clock.start(toLightTime, toDarkTime, forceSwitch)
        break
      case Status.COORDINATE:
        const {latitude, longitude} = setting.coordinate
        const {sunrise, sunset} = getSuntime(latitude, longitude)
        clock.start(sunrise, sunset, setting.forceSwitch)
        break
    }

    return {
      setting
    }
  },
  actions: {
    setStatus(status: Status) {
      this.setting.status = status
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      if (this.setting.status === Status.DISABLE) {
        clock.stop()
      }
    },
    setToLightTime(toLightTime: string) {
      this.setting.toLightTime = toLightTime
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.start(
        toLightTime,
        this.setting.toDarkTime,
        this.setting.forceSwitch
      )
    },
    setToDarkTime(toDarkTime: string) {
      this.setting.toDarkTime = toDarkTime
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.start(
        this.setting.toLightTime,
        toDarkTime,
        this.setting.forceSwitch
      )
    },
    setCoordinate(coordinate: CoordinateModel) {
      this.setting.coordinate = coordinate
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      const {sunrise, sunset} = getSuntime(
        coordinate.latitude,
        coordinate.longitude
      )
      clock.start(sunrise, sunset, this.setting.forceSwitch)
    },
    setForceSwitch(forceSwitch: boolean) {
      this.setting.forceSwitch = forceSwitch
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.continue(forceSwitch)
    }
  }
})
