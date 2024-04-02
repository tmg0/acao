import { describe, expect, it } from 'vitest'
import { execRunner } from '../src/core/runner'
import { sedSubstitute } from '../packages/sed/src'

describe('sed', () => {
  it('sed substitute', async () => {
    const stdout = await execRunner(sedSubstitute('./tests/caces/docker-compose.yml', { inPlace: false, values: [{ find: '3', replacement: '2' }] }))
    expect(stdout).toMatchInlineSnapshot(`"version: '2'"`)
  })
})
