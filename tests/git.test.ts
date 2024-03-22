import { describe, expect, it } from 'vitest'
import { gitBranch } from '../src/presets/git'

describe('git', () => {
  it('resolve git', async () => {
    const { stdout } = await gitBranch({ showCurrent: true })
    expect(stdout).toBe('main')
  })
})
