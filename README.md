# probot-semantic-pr

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app to automerge pull request when at least 2 contributors approved the pull request throught pull request reviews

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t probot-semantic-pr .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> probot-semantic-pr
```

## Contributing

If you have suggestions for how probot-semantic-pr could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Tom Barreau, Hugo Denis, Robin Durand, Yann Geny <hugo.denis@etudiant.univ-rennes1.fr>
