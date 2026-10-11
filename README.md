# Higgsfield Seedance 2.5 Example

Minimal TypeScript example that calls the Higgsfield API to generate a video with
[`bytedance/seedance-2.5/text-to-video`](https://console.higgsfield.ai/models/bytedance/seedance-2.5/text-to-video/api-reference)
using the official [`@higgsfield/client`](https://github.com/higgsfield-ai/higgsfield-js) SDK.

## Prerequisites

- Node.js 18+ and npm
- A Higgsfield API key (key ID + key secret) from the [Higgsfield console](https://console.higgsfield.ai)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in your real credentials:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set:

   ```
   HF_CREDENTIALS=your-key-id:your-key-secret
   ```

   Exactly one colon, no quotes, no extra characters. `.env.local` is gitignored —
   never commit it.

## Run

```bash
npm start
```

This sends a **billable** generation request (prompt: "A cinematic scene at sunset",
5s, 720p, 16:9) and waits for it to complete. On success it prints the generated
video URL. Failed, canceled, or content-moderated ("nsfw") requests are reported as
errors rather than treated as success.

## Files

- [`index.ts`](index.ts) — the example script
- [`.env.example`](.env.example) — documents the required `HF_CREDENTIALS` format
- `.env.local` — your real credentials (not committed)
