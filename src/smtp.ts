import * as core from '@actions/core'
import nodemailer from 'nodemailer'

export async function smtp(
  secure: boolean,
  server: string,
  port: number,
  username: string,
  password: string,
  from: string,
  to: string
): Promise<string> {
  return new Promise(resolve => {
    if (!server) {
      throw new Error('server not a string')
    }
    if (isNaN(port)) {
      throw new Error('port not a number')
    }
    if (!username) {
      throw new Error('username not a string')
    }
    if (!password) {
      throw new Error('password not a string')
    }
    if (!from) {
      throw new Error('from not a string')
    }
    if (!to) {
      throw new Error('to not a string')
    }

    // auth is not yet implemented because
    // haraka forces use of tls when authentication is used
    // and i haven't worked out setting up tls in the workflow yet
    // const auth = {
    //   user: username,
    //   pass: password
    // }
    const transporter = nodemailer.createTransport({
      host: server,
      port,
      secure // upgrade later with STARTTLS
    })

    // verify connection configuration
    transporter.verify(function (error) {
      if (error) {
        core.error(error)
      } else {
        core.debug('Server is ready to take our messages')
      }
    })
    const message = {
      from,
      to,
      subject: 'This is the subject line',
      text: 'Plaintext version of the message',
      html: '<p>HTML version of the message</p>'
    }

    transporter.sendMail(message)
    resolve('done!')
  })
}
