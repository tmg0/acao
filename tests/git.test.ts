import { execaCommand } from 'execa'
import { describe, expect, it } from 'vitest'
import { gitLog } from '../packages/git/src'
import { execRunner } from '../src/core/runner'

describe('git', () => {
  it('gitLog', async () => {
    const stdout = await execRunner(gitLog({ format: '%h' }))
    const { stdout: hash } = await execaCommand('git log --pretty=format:"%h" -1')
    expect(stdout).toBe(JSON.parse(hash))
  })
})
