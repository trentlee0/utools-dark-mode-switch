/* eslint-disable */
declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module globalThis {
  function execCommand(command: string): void
  function execAsync(command: string): Promise<string>

  function setTimeout<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ms?: number,
    ...args: TArgs
  ): NodeJS.Timeout

  function clearTimeout(
    timeoutId: NodeJS.Timeout | string | number | undefined
  ): void

  export function setInterval<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ms?: number,
    ...args: TArgs
  ): NodeJS.Timer

  export function clearInterval(
    intervalId: NodeJS.Timeout | string | number | undefined
  ): void

  namespace NodeJS {
    interface Timer {}
    interface Timeout {}
  }
}
