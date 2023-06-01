export class Endpoint {
  host: string
  port: number

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
  }
}

export const Protocols = {
  UNKNOWN: 'UNKNOWN',
  SMTP: 'SMTP',
  SMTPS: 'SMTPS',
  parse(input: string) {
    if (!input) {
      return this.UNKNOWN
    }
    switch (input.toUpperCase()) {
      case 'SMTP':
        return this.SMTP
      case 'SMTPS':
        return this.SMTPS
      default:
        return this.UNKNOWN
    }
  }
} as const
