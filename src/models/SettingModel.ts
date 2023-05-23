import { Status, StoreKey } from '@/constant'
import { CoordinateModel } from './CoordinateModel'
import { sync } from 'utools-utils/storage'

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
    const status = sync.get<string>(StoreKey.STATUS)
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
      sync.remove(StoreKey.STATUS)
      needed = true
    }

    const toDarkTime = sync.get<string>(StoreKey.TO_DARK_TIME)
    const toLightTime = sync.get<string>(StoreKey.TO_LIGHT_TIME)
    if (toDarkTime) {
      setting.toDarkTime = toDarkTime
      sync.remove(StoreKey.TO_DARK_TIME)
      needed = true
    }

    if (toLightTime) {
      setting.toLightTime = toLightTime
      sync.remove(StoreKey.TO_LIGHT_TIME)
      needed = true
    }

    return needed
  }
}
