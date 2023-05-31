<p align="center">
  <a href="https://github.com/cskwrd/quick-send-action/actions"><img alt="typescript-action status" src="https://github.com/cskwrd/quick-send-action/workflows/build-test/badge.svg"></a>
</p>

Need to run tests in production? Tired of finding your files here when you need them there? Fear not! The QuickSend GitHub Action sends your things when and where you need them, for **_FREE_**!

# Quickstart
Place the following in a new workflow (ex: `.github/workflows/quick-send-quickstart.yml`):
```yml
name: '📡 Transfer Files'
on: push

jobs:
  quickstart:
    runs-on: ubuntu-latest

    steps:
      - name: '🚚 Clone project repository'
        uses: actions/checkout@v3

      - name: '🏗 Build project'
        run: |
          npm ci
          npm run build
    
      - name: '📧 Quickly send files'
        uses: cskwrd/quick-send-action@v0.1
        with:
          protocol: 'smtps'
          remote-host: 'smtp.gmail.com'
          remote-port: 465
          username: ${{ secrets.smtp_username }}
          password: ${{ secrets.smtp_password }}
          smtp-from: ${{ secrets.smtp_username }}
          smtp-to: ${{ secrets.smtp_username }}
          files: |
            dist/**/*
```

### Settings
Keys can be added directly to your .yml config file or referenced from your project `Secrets` storage.

To add a `secret` go to the `Settings` tab in your project then select `Secrets`.
I strongly recommend you store your `password` as a secret.

| Key Name             | Required | Example                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------------|----------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `protocol`           | Yes      | `smtps`                       | At this time, the only valid values are `smtp` or `smtps` (most email providers prefer `smtps`)                                                                          |
| `remote-host`        | Yes      | `smtp.gmail.com`              | SMTP server host name                                                                                                                                                    |
| `remote-port`        | Yes      | `465`                         | The open port one the SMTP server                                                                                                                                        |
| `username`           | No       | `example@gmail.com`           | The username to authenticate as    (Leave both `username` and `password` blank to connect without authentication)                                                        |
| `password`           | No       | `some-secret-password`        | The password for the user above    (Leave both `username` and `password` blank to connect without authentication)                                                        |
| `smtp-from`          | Yes      | `example@gmail.com`           | The email address to use as the `FROM` address                                                                                                                           |
| `smtp-to`            | Yes      | `example@gmail.com`           | The email address to use as the `TO` address                                                                                                                             |
| `files`              | Yes      | `transporter-room/**/*`       | List of patterns specifying files to include or exclude    ([More info on patterns](https://github.com/actions/toolkit/tree/main/packages/glob#patterns))                |
