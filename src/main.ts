import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'
import {Endpoint, Protocols} from './classes'
import {smtp} from './smtp'
import * as fs from 'fs'

async function run(): Promise<void> {
  try {
    const required = {required: true}
    const protocol = Protocols.parse(core.getInput('protocol', required))
    const useTLS = protocol === Protocols.SMTPS // TODO : convert this to a enum type, should also handle casing issues
    const remoteHost: string = core.getInput('remote-host', required)
    const remotePort: string = core.getInput('remote-port', required)
    const ep = new Endpoint(remoteHost, parseInt(remotePort, 10))
    core.debug(`Connecting to '${ep.host}' on port '${ep.port}' ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const username = core.getInput('username')
    const password = core.getInput('password')
    const from = core.getInput('smtp-from', required)
    const to = core.getInput('smtp-to', required)
    if (!from) {
      throw new Error('from not a valid string')
    }
    if (!to) {
      throw new Error('to not a valid string')
    }

    const fileGlobs = core.getMultilineInput('files', required)
    const globber = await glob.create(fileGlobs.join('\n'), {
      followSymbolicLinks: false // in prep for sftp, do not follow symlinks
    })
    const attachments: object[] = []
    for await (const file of globber.globGenerator()) {
      if (fs.statSync(file).isFile()) {
        attachments.push({path: file})
      }
    }
    core.debug(`Attaching '${attachments.length}' file(s)...`)
    const message = {
      from,
      to,
      subject: `[${github.context.repo}] Here is your QuickSend File Transfer`,
      text: 'See attached',
      attachments
    }

    await smtp(useTLS, ep, username, password, message)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
