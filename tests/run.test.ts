import { describe, expect, it } from 'vitest'
import { execaCommand } from 'execa'

describe('run', () => {
  it('execa', async () => {
    const { stdout } = await execaCommand('echo 1')
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })
})
