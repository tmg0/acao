import { defineCommand } from 'citty'
import { version } from '../package.json'

export const main = defineCommand({
  meta: { name: 'acao', version },
  run() {

  },
})
