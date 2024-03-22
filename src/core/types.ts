export type AcaoJobStep = (ctx: string[]) => Promise<string>

export interface AcaoJob {
  steps: AcaoJobStep[]
}

export interface Options {
  jobs: Record<string, AcaoJob>
}
