import { describe, expect, it } from 'vitest'
import { readFile } from '../src'

describe('fs', () => {
  it('read file', async () => {
    const stdout = await readFile('./tests/caces/docker-compose.yml')(undefined, {} as any)
    expect(stdout).toMatchInlineSnapshot(`
      "version: '3'
      "
    `)
  })
})
