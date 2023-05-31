import * as core from '@actions/core'
import * as github from '@actions/github'
import * as glob from '@actions/glob'
import {Endpoint, Protocols} from './classes'
import {smtp} from './smtp'
import * as fs from 'fs'
import {Colorizer} from './colorizer'
import {TextEffects} from './text-effects'

async function run(): Promise<void> {
  try {
    printBanner()

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

    core.startGroup('Connection Info')
    core.info(
      `${TextEffects.DIM}${Colorizer.WHITE}Protocol:${Colorizer.OFF} ${Colorizer.RED}${protocol}${Colorizer.OFF}`
    )
    let formattedUsername = `\x1b[90mSomething Falsy${Colorizer.OFF}`
    if (username) {
      formattedUsername = `${Colorizer.RED}${username}${Colorizer.OFF}`
    }
    core.info(
      `${TextEffects.DIM}${Colorizer.WHITE}Username:${Colorizer.OFF} ${formattedUsername}`
    )
    let formattedPassword = `\x1b[90mSomething Falsy${Colorizer.OFF}`
    if (password) {
      formattedPassword = `${Colorizer.RED}<redacted>${Colorizer.OFF}`
    }
    core.info(
      `${TextEffects.DIM}${Colorizer.WHITE}Password:${Colorizer.OFF} ${formattedPassword}`
    )
    core.info(
      `${TextEffects.DIM}${Colorizer.WHITE}Remote Host:${Colorizer.OFF} ${Colorizer.RED}${ep.host}${Colorizer.OFF}`
    )
    core.info(
      `${TextEffects.DIM}${Colorizer.WHITE}Remote Port:${Colorizer.OFF} ${Colorizer.RED}${ep.port}${Colorizer.OFF}`
    )
    core.endGroup()

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
      subject: `[${github.context.repo.owner}/${github.context.repo.repo}] Here is your QuickSend File Transfer`,
      text: 'See attached',
      attachments
    }

    await smtp(useTLS, ep, username, password, message)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

function printBanner(): void {
  core.info(
    `------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`
  )
  core.info(
    `Thanks for using ${TextEffects.BOLD}${Colorizer.GREEN}QuickSend File Transfer${Colorizer.OFF}. We'll get those files where you need need them as fast as ethernet, fiber optics, and radio waves will carry them! 🚀`
  )
  core.info(
    `------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`
  )
  core.info(
    `👀 Interested in saving time in the future? Watch the repository to get notified about new releases! --> https://github.com/cskwrd/quick-send-action/subscription`
  )
  core.info(
    `🌟 Want to ${Colorizer.YELLOW}spend less time waiting${Colorizer.OFF} on friends or co-workers? Star the repo to and expose them to QuickSend! --> https://github.com/cskwrd/quick-send-action`
  )
  core.info(
    `❓ Have a question? Start a discussion! --> https://github.com/cskwrd/quick-send-action/discussions`
  )
  core.info(
    `🐛 Found a bug? ${TextEffects.BOLD}${Colorizer.BLACK}IMPOSSIBLE! Haha, just kidding.${Colorizer.OFF} Open an issue! --> https://github.com/cskwrd/quick-send-action/issues`
  )
  core.info(
    `------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`
  )
  core.info(`📦 Version: ${process.env.GITHUB_ACTION_REF}`)
  core.info(
    `------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`
  )
}
