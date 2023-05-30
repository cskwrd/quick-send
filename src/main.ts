import * as core from '@actions/core'
import {smtp} from './smtp'

async function run(): Promise<void> {
  try {
    const secure = core.getInput('protocol') === 'smtps' // TODO : convert this to a enum type, should also handle casing issues
    const remoteHost: string = core.getInput('remote-host')
    const remotePort: string = core.getInput('remote-port')
    core.debug(`Connecting to '${remoteHost}' on port '${remotePort}' ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const username = core.getInput('username')
    const password = core.getInput('password')
    const from = core.getInput('smtp-from')
    const to = core.getInput('smtp-to')

    await smtp(
      secure,
      remoteHost,
      parseInt(remotePort, 10),
      username,
      password,
      from,
      to
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
