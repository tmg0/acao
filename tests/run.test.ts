import { describe, expect, it } from 'vitest'
import { run } from '../src'

describe('run', () => {
  it('basic', async () => {
    const stdout = await run('echo Hello')(undefined, {} as any)
    expect(stdout).toBe('"Hello"')
  })

  it('transform', async () => {
    const stdout = await run('echo Hello', { transform: stdout => stdout[1] })(undefined, {} as any)
    expect(stdout).toBe('H')
  })
})
