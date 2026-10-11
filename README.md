# Higgsfield CLI Example

Minimal TypeScript CLI that calls the Higgsfield API to generate videos (via
[`bytedance/seedance-2.5/text-to-video`](https://console.higgsfield.ai/models/bytedance/seedance-2.5/text-to-video/api-reference))
or images (via `higgsfield-ai/soul/v2/standard`) using the official
[`@higgsfield/client`](https://github.com/higgsfield-ai/higgsfield-js) SDK.

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
npm start -- --prompt "A cinematic scene at sunset"
```

Every run sends a **billable** generation request and waits for it to complete.
On success it prints the generated video or image URL(s). Failed or
content-moderated ("nsfw") requests are reported as errors rather than treated
as success.

Run `npm start -- --help` to see all options. Key flags:

- `--prompt <text>` — required.
- `--model <id>` — `video` (default, Seedance 2.5) or `image` (Soul), or a raw
  Higgsfield model endpoint string.
- Video only: `--duration <seconds>` (default 5), `--resolution <480p|720p|1080p>`
  (default 720p), `--aspect-ratio <ratio>` (default 16:9).
- Image only: `--size <WxH>` (e.g. `1536x1536`), `--quality <720p|1080p>`,
  `--batch-size <1|4>`.

Examples:

```bash
# Video (explicit flags, same as the defaults)
npm start -- --prompt "A cinematic scene at sunset" --model video --duration 5 --resolution 720p --aspect-ratio 16:9

# Image
npm start -- --prompt "Editorial portrait in soft daylight" --model image --size 1536x1536 --quality 1080p
```

## Files

- [`index.ts`](index.ts) — the example script
- [`.env.example`](.env.example) — documents the required `HF_CREDENTIALS` format
- `.env.local` — your real credentials (not committed)
