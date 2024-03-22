import { describe, expect, it } from 'vitest'
import { resolveGit } from '../src/git'

describe('git', () => {
  it('resolve git', async () => {
    const git = await resolveGit()
    expect(git?.branch).toBe('main')
  })
})
