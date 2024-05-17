import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { defineCommand } from 'citty'
import consola from 'consola'
import { execaCommand } from 'execa'

interface PromptLoopOptions {
  exec?: boolean
}

async function promptLoop(steps: string[] = [], options: PromptLoopOptions) {
  const ans = await consola.prompt('Step:', { placeholder: 'Enter the command or q...' }) as string
  if (ans === 'q')
    return steps
  const cmd = ans.trim()
  steps.push(cmd)
  if (options.exec)
    await execaCommand(cmd, { shell: true, stdio: 'inherit' })
  await promptLoop(steps, options)
}

export default defineCommand({
  meta: { name: 'record', description: 'Record job steps' },

  args: {
    JOB: {
      type: 'positional',
      description: 'Specific single job name',
      required: false,
    },

    ts: {
      type: 'boolean',
      description: 'Use typescript config file',
      required: false,
      default: true,
    },

    noExec: {
      type: 'boolean',
      description: 'Ignore run command during entering',
      required: false,
      default: false,
    },

    noUpdateNotifier: {
      type: 'boolean',
      description: 'Ignore Acao update notifier',
      required: false,
      default: false,
    },
  },

  async run(ctx) {
    const key = ctx.args.JOB || 'job'
    const steps: string[] = []
    await promptLoop(steps, { exec: !ctx.args.noExec })
    const imports = ['import { defineConfig } from \'acao\'']
    const exports = [`export default defineConfig({
  jobs: {
    ${key}: {
      steps: [${steps.map(step => JSON.stringify(step)).join(', ')}]
    }
  }
})`]
    const code = [...imports, ...exports].join('\n')
    const ext = ctx.args.ts ? 'ts' : 'js'
    await writeFile(join(process.cwd(), `acao.config.${ext}`), code)
  },
})
