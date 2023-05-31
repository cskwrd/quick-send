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

  let authObj = undefined
  if (username || password) {
    authObj = {
      user: username,
      pass: password
    }
  }
  const transporter = nodemailer.createTransport({
    host: endpoint.host,
    port: endpoint.port,
    secure: useTLS, // will auto-upgrade (regardless of this setting) later with STARTTLS, if server supports it
    auth: authObj,
    tls: {
      // do not fail on invalid certs if connecting to localhost... well strings that start with '127'
      rejectUnauthorized: !endpoint.host.startsWith('127')
    }
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
