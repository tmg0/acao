import { describe, expect, it } from 'vitest'
import { runRunner } from '../src/core/runner'
import { readFile } from '../packages/fs/src'

describe('fs', () => {
  it('read file', async () => {
    const stdout = await runRunner(readFile('./tests/caces/docker-compose.yml'))
    expect(stdout).toMatchInlineSnapshot(`
      "version: '3'
      "
    `)
  })
})
