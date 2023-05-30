export class Endpoint {
  host: string
  port: number

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
  }
}

export const Protocols = {
  None: 0,
  SMTP: 1,
  SMTPS: 2,
  parse(input: string) {
    if (!input) {
      return this.None
    }
    switch (input.toUpperCase()) {
      case 'SMTP':
        return this.SMTP
      case 'SMTPS':
        return this.SMTPS
      default:
        return this.None
    }
  }
} as const
