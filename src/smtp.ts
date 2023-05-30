import * as core from '@actions/core'
import {Endpoint} from './classes'
import nodemailer from 'nodemailer'

export async function smtp(
  useTLS: boolean,
  endpoint: Endpoint,
  username: string,
  password: string,
  payload: object
): Promise<object> {
  if (!endpoint.host) {
    throw new Error('server not a string')
  }
  if (isNaN(endpoint.port)) {
    throw new Error('port not a number')
  }
  if (!username) {
    throw new Error('username not a string')
  }
  if (!password) {
    throw new Error('password not a string')
  }

  // auth is not yet implemented because
  // haraka forces use of tls when authentication is used
  // and i haven't worked out setting up tls in the workflow yet
  // const auth = {
  //   user: username,
  //   pass: password
  // }
  const transporter = nodemailer.createTransport({
    host: endpoint.host,
    port: endpoint.port,
    secure: useTLS // will auto-upgrade later with STARTTLS, if server supports it
  })

  // verify connection configuration
  transporter.verify(function (error) {
    if (error) {
      core.error(error)
    } else {
      core.debug('Server is ready to take our messages')
    }
  })

  const message = payload

  // TODO : handle connection errors and implement retry
  return transporter.sendMail(message)
}
