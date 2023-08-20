# Zelem

Zelem is a service that provides a Slack bot responsible for a question and answer game. BYO bot user and tokens.

## Requirements

- Docker (for local development)
- Node 20

## Commands

Create a local `.env` file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm i
```

Run tests:

```bash
npm t
```

Start the local environment:

```bash
npm run local-env:start
```

Run:

```bash
npm run dev
```

### Other

Local environment:

```bash
npm run local-env:stop
npm run local-env:clean
```
