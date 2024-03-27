import { describe, expect, it } from 'vitest'
import { run } from '../src'

describe('run', () => {
  it('basic', async () => {
    const stdout = await run('echo 1')(undefined, {} as any)
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })

  it('transform', async () => {
    const stdout = await run('echo 1', { transform: stdout => Number(JSON.parse(stdout)) })(undefined, {} as any)
    expect(stdout).toMatchInlineSnapshot(`1`)
  })
})
