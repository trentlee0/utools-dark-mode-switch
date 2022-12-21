export enum Mode {
  DARK,
  LIGHT
}

export abstract class Script {
  abstract toOther(): void

  abstract toMode(mode: Mode): void

  toDark(): void {
    this.toMode(Mode.DARK)
  }

  toLight(): void {
    this.toMode(Mode.LIGHT)
  }

  abstract isDark(): Promise<boolean>
}

export class EmptyScript extends Script {
  toOther(): void {
    throw new Error('Method not implemented.')
  }

  toMode(mode: Mode): void {
    throw new Error('Method not implemented.')
  }

  isDark(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
