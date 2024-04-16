import pacote from 'pacote'
import semver from 'semver'
import consola from 'consola'
import { colors } from 'consola/utils'
import packageJson from '../../package.json'

export async function checkForUpdateOf(name: string, current: string = packageJson.version) {
  let needsUpdate = false
  let latest = current

  try {
    const manifest = await pacote.packument(name)
    latest = manifest['dist-tags'].latest
    needsUpdate = latest !== current && semver.lt(current, latest)
  }
  catch {
    console.log()
    consola.warn(`Cannot fetch the latest version of ${name} by npm.`)
  }

  return {
    name,
    current,
    latest,
    needsUpdate,
  }
}

export async function checkUpdates() {
  const { name, current, latest, needsUpdate } = await checkForUpdateOf(packageJson.name)
  if (needsUpdate)
    consola.box(`Update available! ${colors.red(current)} → ${colors.green(latest)}.\nRun "${colors.magenta(`npm install -D ${name}`)}" to update.`)
}
