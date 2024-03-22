import { describe, expect, it } from 'vitest'
import { resolveGit } from '../src/git'

describe('git', () => {
  it('resolve git', async () => {
    const { branch } = await resolveGit()
    expect(branch).toBe('main')
  })
})
