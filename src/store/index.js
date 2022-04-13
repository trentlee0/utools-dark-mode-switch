const storage = require("../storage")

const status = {Enable: '开启', Disable: '关闭'}

const storeKey = {
  Status: 'status',
  ToLightTime: 'toLightTime',
  ToDarkTime: 'toDarkTime'
}

const store = {
  status: status.Disable,
  toLightTime: '07:00',
  toDarkTime: '18:00',
  setStatus(status) {
    this.status = status
    list[0].description = status
    storage.set(storeKey.Status, status)
  },
  setToLightTime(toLightTime) {
    this.toLightTime = toLightTime
    list[1].description = toLightTime
    storage.set(storeKey.ToLightTime, toLightTime)
  },
  setToDarkTime(toDarkTime) {
    this.toDarkTime = toDarkTime
    list[2].description = toDarkTime
    storage.set(storeKey.ToDarkTime, toDarkTime)
  }
}

const list = [
  {
    title: '是否开启',
    description: store.status,
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

module.exports = {
  status,
  storeKey,
  store,
  list
}
