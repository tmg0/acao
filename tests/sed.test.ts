import { describe, expect, it } from 'vitest'
import { sedSubstitute } from '../packages/sed/src'
import { execRunner } from '../src/core/runner'

describe('sed', () => {
  it('sed substitute', async () => {
    const stdout = await execRunner(sedSubstitute('./tests/caces/docker-compose.yml', { inPlace: false, values: [{ find: '3', replacement: '2' }] }))
    expect(stdout).toMatchInlineSnapshot(`"version: '2'"`)
  })
})
