import { Status, StoreKey } from '@/constant'
import { CoordinateModel } from './CoordinateModel'
import { storage } from 'utools-utils'

export class SettingModel {
  status: Status
  toLightTime: string
  toDarkTime: string
  forceSwitch: boolean
  coordinate: CoordinateModel

  constructor(
    status: Status,
    toLightTime: string,
    toDarkTime: string,
    forceSwitch: boolean,
    coordinate: CoordinateModel
  ) {
    this.status = status
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.forceSwitch = forceSwitch
    this.coordinate = coordinate
  }

  public static readonly DEFAULT = new SettingModel(
    Status.DISABLE,
    '07:00',
    '18:00',
    false,
    CoordinateModel.DEFAULT
  )

  public static migrateDatabase(setting: SettingModel) {
    let needed = false
    const status = storage.sync.get<string>(StoreKey.STATUS)
    if (!status) return needed

    if (status) {
      switch (status) {
        case '关闭':
          setting.status = Status.DISABLE
          break
        case '开启':
          setting.status = Status.AUTO_TIME
          break
      }
      storage.sync.remove(StoreKey.STATUS)
      needed = true
    }

    const toDarkTime = storage.sync.get<string>(StoreKey.TO_DARK_TIME)
    const toLightTime = storage.sync.get<string>(StoreKey.TO_LIGHT_TIME)
    if (toDarkTime) {
      setting.toDarkTime = toDarkTime
      storage.sync.remove(StoreKey.TO_DARK_TIME)
      needed = true
    }

    if (toLightTime) {
      setting.toLightTime = toLightTime
      storage.sync.remove(StoreKey.TO_LIGHT_TIME)
      needed = true
    }

    return needed
  }
}
