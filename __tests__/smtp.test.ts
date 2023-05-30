import { Endpoint } from '../src/classes'
import {smtp} from '../src/smtp'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {describe, expect, test} from '@jest/globals'

describe("required inputs", () => {
  describe("remote-port", () => {
    test('throws invalid number', async () => {
      const server = 'some.server'
      const port = parseInt('foo', 10)
      await expect(smtp(false, new Endpoint(server, port), "username", "password", {})).rejects.toThrow('port not a number')
    })
  })
})

// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

// // shows how the runner will run a javascript action with env / stdout protocol
// // note: this seems to fail when executing with `npm test` locally
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
