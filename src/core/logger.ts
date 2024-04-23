import { resolve } from 'node:path'
import { colors } from 'consola/utils'
import logUpdate from 'log-update'
import { version } from '../../package.json'
import type { AcaoContext } from './types'
import { elegantSpinner, sleep } from './utils'

type JobState = 'pending' | 'fulfilled' | 'rejected'

function createInterval(cb: () => any, ms = 100) {
  let id: any
  let isRunning = false

  function execute() {
    id = setTimeout(() => {
      cb()
      if (isRunning)
        execute()
    }, ms)
  }

  function start() {
    if (!isRunning) {
      isRunning = true
      execute()
    }
  }

  function pause() {
    if (id)
      clearTimeout(id)
    isRunning = false
  }

  return { start, pause }
}

export class Logger {
  spinner = elegantSpinner()

  private _interval = createInterval(() => this.printJobs())
  private _states: Record<string, JobState[]> = {}

  constructor(
    public ctx: AcaoContext,
    public console = globalThis.console,
  ) {}

  log(...args: any[]) {
    this.console.log(...args)
  }

  setup(jobs: string[][]) {
    jobs.flat().forEach((key) => {
      const steps = this.ctx.options.jobs[key]?.steps ?? []
      this._states[key] = steps.map(() => 'pending')
    })

    this._interval.start()
  }

  async printBanner() {
    this.log()
    const _version = colors.blue(`v${version}`)
    this.log(`${colors.inverse(colors.bold(' Acao '))} ${_version} ${colors.gray(resolve('.'))}`)
    this.log()
  }

  printJobs() {
    const spin = colors.yellow(this.spinner())
    const prefixs = { pending: spin, fulfilled: colors.green('✔'), rejected: colors.red('✖') }
    logUpdate(Object.entries(this._states).map(([name, states]) => {
      const s = states.includes('rejected') ? 'rejected' : states.includes('pending') ? 'pending' : 'fulfilled'
      const p = prefixs[s]
      const c = colors.gray(`(${states.filter(i => i === 'fulfilled').length}/${states.length})`)
      const n = this.ctx.options.jobs[name]?.name ?? name
      return `${p} ${n} ${c}`
    }).join('\n'), '\n')
  }

  updateJobState(name: string, state: JobState) {
    this._states[name] = this._states[name].map(() => state)
  }

  updateStepState(name: string, stepIndex: number, state: JobState) {
    this._states[name][stepIndex] = state
  }

  pause() {
    this._interval.pause()
  }

  async done() {
    await sleep(200)
    this._interval.pause()
    logUpdate.done()
    this._states = {}
  }
}
