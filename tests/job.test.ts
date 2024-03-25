import { describe, expect, it } from 'vitest'
import { filterJobs, orderJobs } from '../src/core/context'

describe('job', () => {
  const jobs: any = {
    1: {},
    2: { needs: ['1'] },
    3: { needs: ['1'] },
    4: { needs: ['2', '3'] },
  }

  it('order jobs', async () => {
    expect(orderJobs(jobs)).toMatchInlineSnapshot(`
      [
        [
          "1",
        ],
        [
          "2",
          "3",
        ],
        [
          "4",
        ],
      ]
    `)
  })

  it('filter jobs', async () => {
    expect(filterJobs(orderJobs(jobs), ['3'])).toMatchInlineSnapshot(`
      [
        [
          "1",
        ],
        [
          "3",
        ],
      ]
    `)
  })
})
