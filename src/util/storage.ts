import {isUTools} from './common'

interface Storage {
  get(key: string): any

  set(key: string, value: any): void

  remove(key: string): void
}

class UToolsStorage implements Storage {
  get(key: string): any {
    return utools.dbStorage.getItem(key)
  }

  set(key: string, value: any): void {
    utools.dbStorage.setItem(key, value)
  }

  remove(key: string): void {
    utools.dbStorage.removeItem(key)
  }
}

class BrowserStorage implements Storage {
  get(key: string): any {
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)
    return null
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}

export default isUTools() ? new UToolsStorage() : new BrowserStorage()
