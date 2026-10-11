# Contributing

This is a small example repo, so the process is lightweight.

## Setup

Follow the [README](README.md) setup instructions to install dependencies and
configure your own `.env.local` with your own Higgsfield credentials. Never
commit `.env.local` or paste real credentials into a PR, issue, or commit
message.

## Making changes

1. Create a branch off `main`.
2. Make your change in `index.ts` (or add new example scripts alongside it).
3. Run `npx tsc --noEmit` to type-check.
4. If your change calls the Higgsfield API, note that `npm start` makes a
   **billable** generation request — mention that in your PR description so
   reviewers know running it costs money.
5. Open a PR describing what changed and why.

## Style

- Keep examples minimal and readable over clever. This repo exists to
  demonstrate the SDK, not to be a framework.
- No build step beyond TypeScript type-checking; there's no test suite yet.

## Reporting issues

Open a GitHub issue with a clear description and, if relevant, the exact
error output (with any credentials redacted).
