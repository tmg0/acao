export type AcaoJobStep = (prev: string | undefined, ctx: Record<string, string[]>) => Promise<string>

export interface AcaoJob {
  steps: AcaoJobStep[]
}

export interface Options {
  jobs: Record<string, AcaoJob>
}
