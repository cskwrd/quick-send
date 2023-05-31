import {Endpoint} from '../src/classes'
import {smtp} from '../src/smtp'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {describe, expect, test} from '@jest/globals'

describe('required inputs', () => {
  describe('remote-port', () => {
    test('throws invalid number', async () => {
      const server = 'some.server'
      const port = parseInt('foo', 10)
      await expect(
        smtp(false, new Endpoint(server, port), 'username', 'password', {})
      ).rejects.toThrow('port not a number')
    })
  })
})

// // shows how the runner will run a javascript action with env / stdout protocol
// // note: when an error is thrown the stdout and err are captured but not dumped to the test output
// //       because of this I am not sure this text is supposed to be functional
// //       leaving it here as an example of how you might be able to test the code manual on the runner
// test('test runs', () => {
//   try {
//     process.env['GITHUB_REPOSITORY'] = 'test/run'

//     process.env['INPUT_PROTOCOL'] = 'smtp'
//     process.env['INPUT_REMOTE-HOST'] = '127.1.2.3'
//     process.env['INPUT_REMOTE-PORT'] = '2525'
//     process.env['INPUT_USERNAME'] = 'use-secret-user-in-production'
//     process.env['INPUT_PASSWORD'] = 'use-secret-pass-in-production'
//     process.env['INPUT_SMTP-FROM'] = 'tx@example.com'
//     process.env['INPUT_SMTP-TO'] = 'rx@example.com'
//     process.env['INPUT_FILES'] = 'transporter-room/**/*'
//     const np = process.execPath
//     const ip = path.join(__dirname, '..', 'lib', 'main.js')
//     const options: cp.ExecFileSyncOptions = {
//       env: process.env
//     }
//     const result = cp.execFileSync(np, [ip], {env: process.env}).toString()
//     console.log(result)
//   } catch (error: any) {
//     // for some reason the error is not logged in it isn't caught ang logged like this
//     console.log(error.stdout.toString())
//     expect(false).toBeTruthy()
//   }
// })
