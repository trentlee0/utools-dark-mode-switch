/// <reference types="vite/client" />

declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module globalThis {
  export function execCommand(command: string): void
  export function execAsync(command: string): Promise<string>
}
