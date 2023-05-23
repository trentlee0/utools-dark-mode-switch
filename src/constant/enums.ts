export enum Status {
  DISABLE,
  AUTO_TIME,
  COORDINATE
}

export namespace Status {
  export function desc(e: Status) {
    switch (e) {
      case Status.DISABLE:
        return '关闭'
      case Status.AUTO_TIME:
        return '自定义时间'
      case Status.COORDINATE:
        return '经纬度'
    }
  }

  export function val(d: string) {
    switch (d) {
      case '关闭':
        return Status.DISABLE
      case '自定义时间':
        return Status.AUTO_TIME
      case '经纬度':
        return Status.COORDINATE
    }
    return null
  }
}
