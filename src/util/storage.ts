import {isUTools} from './common'

abstract class Storage {
  abstract get<T>(key: string): T | null

  abstract set(key: string, value: any): void

  abstract remove(key: string): void

  getOrDefault<T>(key: string, defaulVal: T): T {
    return this.get(key) ?? defaulVal
  }
}

class UToolsStorage extends Storage {
  get<T>(key: string): T | null {
    return utools.dbStorage.getItem(key)
  }

  set(key: string, value: any): void {
    utools.dbStorage.setItem(key, value)
  }

  remove(key: string): void {
    utools.dbStorage.removeItem(key)
  }
}

class BrowserStorage extends Storage {
  get<T>(key: string): T | null {
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
