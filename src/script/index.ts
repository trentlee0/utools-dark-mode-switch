import {WindowsScript} from "./windows"
import {MacOsScript} from "./macos"

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

export default utools.isWindows() ? new WindowsScript() : new MacOsScript()
