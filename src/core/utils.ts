import type { AcaoJob, NormalizedJob } from './types'

export const isString = (value: any): value is string => typeof value === 'string'

export function normalizeJobs(jobs: Record<string, AcaoJob>) {
  const _jobs: NormalizedJob[][] = []
  const _executed = new Set()

  let _pendings = Object.entries(jobs).map(([name, job]) => ({ ...job, name }))

  function isFulfilled(name: string) {
    const job = jobs[name]
    const needs = [job.needs].flat().filter(Boolean)
    if (!needs?.length)
      return true
    return needs.every(need => need && _executed.has(need))
  }

  while (_pendings.length) {
    const batch = _pendings.filter(({ name }) => isFulfilled(name))
    if (!batch?.length)
      break
    batch.forEach(({ name }) => { _executed.add(name) })
    _pendings = _pendings.filter(({ name }) => !_executed.has(name))
    _jobs.push(batch)
  }

  return _jobs
}

export function sliceRequiredJobs(jobs: NormalizedJob[][], requires: string[]) {
  if (!requires?.length)
    return jobs

  const _jobs: NormalizedJob[][] = []

  for (const batch of jobs) {
    const names = batch.map(({ name }) => name)
    if (!requires.some(name => names.includes(name))) {
      _jobs.push(batch)
      continue
    }

    const requiredBatches = batch.filter(({ name }) => requires.includes(name))
    if (requiredBatches.length > 0) {
      _jobs.push(requiredBatches)
      break
    }
  }

  return _jobs
}
