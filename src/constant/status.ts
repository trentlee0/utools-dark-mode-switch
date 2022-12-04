import {Status} from './index'

interface AbstractLocaleStatusConverter {
  getLocaleStatuses(): string[]

  statusToLocale(status: Status): string

  localeToStatus(localeStatus: string): Status
}

class ChineseLocaleStatusConverter implements AbstractLocaleStatusConverter {
  private map = new Map<Status, string>([
    [Status.DISABLE, '关闭'],
    [Status.AUTO_TIME, '自定义时间'],
    [Status.COORDINATE, '经纬度']
  ])

  getLocaleStatuses(): string[] {
    const arr: string[] = []
    this.map.forEach(v => arr.push(v))
    return arr
  }

  statusToLocale(status: Status): string {
    return this.map.get(status)!
  }

  localeToStatus(localeStatus: string): Status {
    for (const [key, value] of this.map) {
      if (value === localeStatus) return key
    }
    return Status.DISABLE
  }
}

export function getStatusConverter(): AbstractLocaleStatusConverter {
  return new ChineseLocaleStatusConverter()
}
