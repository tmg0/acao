import { describe, expect, it } from 'vitest'
import { execaCommand } from 'execa'
import { run, runRunner } from '../src/index'

describe('run', () => {
  it('execa', async () => {
    const { stdout } = await execaCommand('echo 1')
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })

  it('basic', async () => {
    const stdout = await runRunner(run('echo 1'))
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })
})
