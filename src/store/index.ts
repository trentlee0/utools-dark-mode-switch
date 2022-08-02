import storage from '@/util/storage'
import {defineStore} from 'pinia'
import clock from '@/util/clock'
import {getSuntime} from '@/util/suntime'
import {deepCopy} from '@/util/common'

export enum Status {
  DISABLE,
  AUTO_TIME,
  COORDINATE
}

export enum StoreKey {
  SETTING = 'setting'
}

export class Coordinate {
  latitude: number = 39.9
  longitude: number = 116.3

  public static build(latitude: number, longitude: number) {
    const c = new Coordinate()
    c.latitude = latitude
    c.longitude = longitude
    return c
  }
}

export class Setting {
  status: Status = Status.DISABLE
  forceSwitch: boolean = false
  toLightTime: string = '07:00'
  toDarkTime: string = '18:00'
  coordinate: Coordinate = new Coordinate()
}

export const useStore = defineStore('main', {
  state: () => ({
    setting: storage.get(StoreKey.SETTING) ?? new Setting()
  }),
  actions: {
    setStatus(status: Status) {
      this.setting.status = status
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      if (this.status === Status.DISABLE) {
        clock.stop()
      }
    },
    setToLightTime(toLightTime: string) {
      this.setting.toLightTime = toLightTime
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.start(toLightTime, this.toDarkTime, this.forceSwitch)
    },
    setToDarkTime(toDarkTime: string) {
      this.setting.toDarkTime = toDarkTime
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.start(this.toLightTime, toDarkTime, this.forceSwitch)
    },
    setCoordinate(coordinate: Coordinate) {
      this.setting.coordinate = coordinate
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      const {sunrise, sunset} = getSuntime(
        coordinate.latitude,
        coordinate.longitude
      )
      clock.start(sunrise, sunset, this.forceSwitch)
    },
    setForceSwitch(forceSwitch: boolean) {
      this.setting.forceSwitch = forceSwitch
      storage.set(StoreKey.SETTING, deepCopy(this.setting))

      clock.stop()
      clock.continue(forceSwitch)
    }
  },
  getters: {
    status(state) {
      return state.setting.status
    },
    toLightTime(state) {
      return state.setting.toLightTime
    },
    toDarkTime(state) {
      return state.setting.toDarkTime
    },
    forceSwitch(state) {
      return state.setting.forceSwitch
    }
  }
})
