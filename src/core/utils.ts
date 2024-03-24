import { klona } from 'klona'
import type { AcaoJob, NormalizedJob } from './types'

export const isString = (value: any): value is string => typeof value === 'string'

export function normalizeJobs(jobs: Record<string, AcaoJob>) {
  const _jobs: NormalizedJob[][] = []
  const _original = klona(jobs)
  let _inProcess = Object.keys(_original)

  function isFulfilled(name: string) {
    const job = jobs[name]
    const needs = [job.needs].flat().filter(Boolean)
    if (!needs?.length)
      return true
    return needs.every(need => need && _jobs.flat().map(({ name }) => name).includes(need))
  }

  while (_inProcess.length) {
    const batch = _inProcess.filter(name => isFulfilled(name)).map(name => ({ ..._original[name], name }))
    if (!batch?.length)
      break
    _inProcess = _inProcess.filter(jobId => !batch.map(({ name }) => name).includes(jobId))
    _jobs.push(batch)
  }

  return _jobs
}

export function sliceRequiredJobs(jobs: NormalizedJob[][], requires: string[]) {
  if (!requires?.length)
    return jobs

  const _jobs: NormalizedJob[][] = []

  for (const batch of jobs) {
    if (!requires.some(name => batch.map(({ name }) => name).includes(name))) {
      _jobs.push(batch)
      continue
    }

    const requiredBatch = batch.filter(({ name }) => requires.includes(name))
    if (requiredBatch.length > 0) {
      _jobs.push(requiredBatch)
      break
    }
  }

  return _jobs
}
