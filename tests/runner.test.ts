import { describe, expect, it } from 'vitest'
import { execa } from 'execa'
import { defineRunner, run, runRunner } from '../src/core/runner'

describe('runner', () => {
  it('define runner', async () => {
    const echoHello = defineRunner(async () => {
      return (await execa('echo', ['Hello'])).stdout
    })
    expect(await runRunner(echoHello)).toMatchInlineSnapshot(`"Hello"`)
  })

  it('run', async () => {
    const stdout = await runRunner(run('echo 1'))
    expect(Number(stdout)).toMatchInlineSnapshot(`1`)
  })

  it('transform stdout', async () => {
    const stdout = await runRunner(run('echo 1', { transform: stdout => Number(JSON.parse(stdout)) }))
    expect(stdout).toMatchInlineSnapshot(`1`)
  })
})
