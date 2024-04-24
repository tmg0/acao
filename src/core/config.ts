import { loadConfig } from 'c12'
import type { Options } from './types'

export async function loadAcaoConfig() {
  const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false, defaultConfig: { jobs: {} } as any })
  return config
}
