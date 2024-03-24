import { resolveOptions } from './options'
import { createSSH } from './ssh'
import type { AcaoContext, AcaoJob, Options } from './types'

export function createAcao(rawOptions: Partial<Options> | undefined | null = {}) {
  const options = resolveOptions(rawOptions)

  const ctx: AcaoContext = {
    options,
    outputs: {},
  }

  async function runJobs(requires: string[] = []) {
    const ordered = filterJobs(orderJobs(options.jobs), requires)

    for (const batch of ordered) {
      await Promise.all(batch.map(name => (async function () {
        const job = options.jobs[name]
        const ssh = createSSH(job.ssh)
        if (ssh)
          await ssh.connect?.()
        if (!ctx.outputs[name])
          ctx.outputs[name] = []
        let index = 0
        for (const step of job.steps) {
          const prev = index > 0 ? ctx.outputs[name][index - 1] : undefined
          const stdout = await step(prev, { ...ctx, job: name, step: index, ssh })
          ctx.outputs[name].push(stdout)
          index = index + 1
        }
        ssh?.close()
      })()))
    }
  }

  return {
    options,
    runJobs,
  }
}

export function filterJobs(jobs: string[][], filter: string[]) {
  if (!filter?.length)
    return jobs

  const _jobs: string[][] = []

  for (const batch of jobs) {
    if (!filter.some(name => batch.includes(name))) {
      _jobs.push(batch)
      continue
    }

    const requiredBatches = batch.filter(name => filter.includes(name))
    if (requiredBatches.length > 0) {
      _jobs.push(requiredBatches)
      break
    }
  }

  return _jobs
}

export function orderJobs(jobs: Record<string, AcaoJob>) {
  const inDegree: Record<string, number> = {}
  const graph: Record<string, string[]> = {}
  const sorted = []

  let queue: string[] = []

  for (const name of Object.keys(jobs)) {
    inDegree[name] = 0
    graph[name] = []
  }

  for (const [name, job] of Object.entries(jobs)) {
    const needs = [job.needs].flat().filter(Boolean) as string[]
    if (needs?.length) {
      for (const need of needs) {
        graph[need].push(name)
        inDegree[name]++
      }
    }
  }

  for (const [name, degree] of Object.entries(inDegree)) {
    if (degree === 0)
      queue.push(name)
  }

  while (queue.length) {
    const batch = []
    const nextQueue = []

    for (const task of queue) {
      batch.push(task)
      for (const nextTask of graph[task]) {
        inDegree[nextTask]--
        if (inDegree[nextTask] === 0)
          nextQueue.push(nextTask)
      }
    }

    sorted.push(batch)
    queue = nextQueue
  }

  if (sorted.flat().length !== Object.keys(jobs).length)
    return []

  return sorted
}
