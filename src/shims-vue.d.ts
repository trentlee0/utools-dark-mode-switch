/* eslint-disable */
declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module globalThis {
  function exec(
    command: string,
    callback?: (
      error: ExecException | null,
      stdout: string,
      stderr: string
    ) => void
  ): ChildProcess

  function setTimeout<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ms?: number,
    ...args: TArgs
  ): NodeJS.Timeout

  function clearTimeout(
    timeoutId: NodeJS.Timeout | string | number | undefined
  ): void

  function setInterval<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    ms?: number,
    ...args: TArgs
  ): NodeJS.Timer

  function clearInterval(
    intervalId: NodeJS.Timeout | string | number | undefined
  ): void

  namespace NodeJS {
    interface Timer {}
    interface Timeout {}
  }
}
