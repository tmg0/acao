import { describe, expect, it } from 'vitest'
import { defineConfig } from '../src'

describe('config', () => {
  it('define config', async () => {
    defineConfig((options) => {
      expect(options.git?.branch).toBe('main')
      return {}
    })
  })
})
