import { describe, expect, it } from 'vitest'
import { run } from '../src'

describe('run', () => {
  it('basic', async () => {
    const stdout = await run('echo 1')(undefined, {} as any)
    expect(stdout).toBe('1')
  })

  it('transform', async () => {
    const stdout = await run('echo 1', { transform: stdout => Number(stdout) })(undefined, {} as any)
    expect(stdout).toBe(1)
  })
})
