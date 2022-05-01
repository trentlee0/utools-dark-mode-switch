import storage from "../storage"

export enum Status {
  ENABLE,
  DISABLE
}

export const storeKey = {
  Status: 'status',
  ToLightTime: 'toLightTime',
  ToDarkTime: 'toDarkTime'
}

export function convertStatus(status: Status) {
  switch (status) {
    case Status.DISABLE:
      return '关闭'
    case Status.ENABLE:
      return '开启'
  }
}

export const store = {
  status: Status.DISABLE,
  toLightTime: '07:00',
  toDarkTime: '18:00',
  setStatus(status: Status) {
    this.status = status
    showList[0].description = convertStatus(status)
    storage.set(storeKey.Status, status)
  },
  setToLightTime(toLightTime: string) {
    this.toLightTime = toLightTime
    showList[1].description = toLightTime
    storage.set(storeKey.ToLightTime, toLightTime)
  },
  setToDarkTime(toDarkTime: string) {
    this.toDarkTime = toDarkTime
    showList[2].description = toDarkTime
    storage.set(storeKey.ToDarkTime, toDarkTime)
  }
}

export const showList = [
  {
    title: '是否开启',
    description: convertStatus(store.status),
    icon: 'icon/day-night.png'
  },
  {
    title: '浅色模式时间',
    description: store.toLightTime,
    icon: 'icon/day.png'
  },
  {
    title: '深色模式时间',
    description: store.toDarkTime,
    icon: 'icon/night.png'
  }
]
