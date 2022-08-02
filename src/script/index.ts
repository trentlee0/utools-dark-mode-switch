import {WindowsScript} from './windows'
import {MacOsScript} from './macos'
import {isUTools} from '@/util/common'

export enum Mode {
  DARK,
  LIGHT
}

export interface Script {
  switchMode(): string

  switchTo(mode: Mode): string

  switchToDark(): string

  switchToLight(): string

  getDarkMode(): string

  isDarkMode(scriptResult: string): boolean
}

class EmptyScriptImpl implements Script {
  switchMode(): string {
    throw new Error('Method not implemented.')
  }

  switchTo(mode: Mode): string {
    throw new Error('Method not implemented.')
  }

  switchToDark(): string {
    throw new Error('Method not implemented.')
  }

  switchToLight(): string {
    throw new Error('Method not implemented.')
  }

  getDarkMode(): string {
    throw new Error('Method not implemented.')
  }

  isDarkMode(scriptResult: string): boolean {
    throw new Error('Method not implemented.')
  }
}

export default isUTools()
    ? utools.isWindows()
        ? new WindowsScript()
        : new MacOsScript()
    : new EmptyScriptImpl()
