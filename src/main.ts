import * as core from '@actions/core'
// import {wait} from './wait'
import {smtp} from './smtp'

async function run(): Promise<void> {
  try {
    const remoteHost: string = core.getInput('remote-host')
    const remotePort: string = core.getInput('remote-port')
    core.debug(`Connecting to '${remoteHost}' on port '${remotePort}' ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await smtp(remoteHost, parseInt(remotePort, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
