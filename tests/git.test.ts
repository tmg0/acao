import { describe, expect, it } from 'vitest'
import { execaCommand } from 'execa'
import { execRunner } from '../src/core/runner'
import { gitLog } from '../packages/git/src'

describe('git', () => {
  it('gitLog', async () => {
    const stdout = await execRunner(gitLog({ format: '%h' }))
    const { stdout: hash } = await execaCommand('git log --pretty=format:"%h" -1')
    expect(stdout).toBe(JSON.parse(hash))
  })
})
