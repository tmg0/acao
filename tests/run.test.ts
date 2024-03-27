import { describe, expect, it } from 'vitest'
import { execaCommand } from 'execa'
import { run } from '../src'

describe('run', () => {
  it('execa', async () => {
    const { stdout } = await execaCommand('echo 1')
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })

  it('basic', async () => {
    const stdout = await run('echo 1')(undefined, {} as any)
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })
})
