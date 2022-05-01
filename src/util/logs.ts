import * as fs from "fs"
import {fill2Zero} from "./utils";

abstract class Log {
  info(message: string): void {
    this.print(Log.getOutLine(message, 'info'))
  }

  error(message: string): void {
    this.print(Log.getOutLine(message, 'error'))
  }

  debug(message: string): void {
    this.print(Log.getOutLine(message, 'info'))
  }

  private static getOutLine(message: string, level: "info" | "error" | "debug"): string {
    const date = new Date()
    const year = fill2Zero(date.getFullYear())
    const month = fill2Zero(date.getMonth() + 1)
    const day = fill2Zero(date.getDate())
    const hour = fill2Zero(date.getHours())
    const minute = fill2Zero(date.getMinutes())
    const second = fill2Zero(date.getSeconds())
    return `${year}-${month}-${day} ${hour}:${minute}:${second} [${level}]: ${message}\n`
  }

  abstract print(message: string): void
}

class FileLog extends Log {
  private path: string

  setPath(path: string): FileLog {
    this.path = path
    return this
  }

  print(message: string): void {
    fs.open(this.path, 'a', (err, fd) => {
      if (err) return
      fs.write(fd, message, () => fs.closeSync(fd))
    })
  }
}

class StdLog extends Log {
  print(message: string): void {
    console.log(message)
  }
}

export function createLogger(type: 'file' | 'stdout', path?: string): Log {
  switch (type) {
    case "file":
      if (!path) throw new Error('文件路径 \'path\' 不为空')
      return new FileLog().setPath(path)
    case "stdout":
      return new StdLog()
  }
}
