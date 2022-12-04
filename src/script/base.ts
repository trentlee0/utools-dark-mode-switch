export enum Mode {
  DARK,
  LIGHT
}

export abstract class Script {
  protected abstract switchScript(): string

  protected abstract switchToScript(mode: Mode): string

  protected abstract getDarkScript(): string

  protected abstract isDarkMode(scriptResult: string): boolean

  toOther(): void {
    execCommand(this.switchScript())
  }

  toLight(): void {
    execCommand(this.switchToScript(Mode.LIGHT))
  }

  toDark(): void {
    execCommand(this.switchToScript(Mode.DARK))
  }

  isDarkAsync(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      execAsync(this.getDarkScript())
        .then((stdout) => resolve(this.isDarkMode(stdout)))
        .catch(reject)
    })
  }
}

export class EmptyScriptImpl extends Script {
  protected switchScript(): string {
    throw new Error('Method not implemented.')
  }

  protected switchToScript(mode: Mode): string {
    throw new Error('Method not implemented.')
  }

  protected getDarkScript(): string {
    throw new Error('Method not implemented.')
  }

  protected isDarkMode(scriptResult: string): boolean {
    throw new Error('Method not implemented.')
  }
}
