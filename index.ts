import { parseArgs } from "node:util";
import { config as loadEnv } from "dotenv";
import { config, higgsfield } from "@higgsfield/client/v2";

loadEnv({ path: ".env.local" });

const MODEL_ALIASES: Record<string, string> = {
  video: "bytedance/seedance-2.5/text-to-video",
  seedance: "bytedance/seedance-2.5/text-to-video",
  image: "higgsfield-ai/soul/v2/standard",
  soul: "higgsfield-ai/soul/v2/standard",
};

const IMAGE_MODELS = new Set(["higgsfield-ai/soul/v2/standard"]);

function printUsageAndExit(message?: string): never {
  if (message) console.error(message + "\n");
  console.error(`Usage: npm start -- --prompt "<text>" [options]

Options:
  --prompt <text>        Required. The generation prompt.
  --model <id>           Model endpoint or alias. Aliases: video (seedance),
                          image (soul). Default: video
  --duration <seconds>   Video only. Default: 5
  --resolution <res>     Video only. One of 480p, 720p, 1080p. Default: 720p
  --aspect-ratio <ratio> Video only. e.g. 16:9, 9:16, 1:1. Default: 16:9
  --size <WxH>           Image only. e.g. 1536x1536 (see SoulSize in
                          @higgsfield/client for all options).
  --quality <q>          Image only. 720p or 1080p.
  --batch-size <n>       Image only. 1 or 4.
  --help                 Show this help.
`);
  process.exit(message ? 1 : 0);
}

const { values } = parseArgs({
  options: {
    prompt: { type: "string" },
    model: { type: "string", default: "video" },
    duration: { type: "string" },
    resolution: { type: "string" },
    "aspect-ratio": { type: "string" },
    size: { type: "string" },
    quality: { type: "string" },
    "batch-size": { type: "string" },
    help: { type: "boolean", default: false },
  },
});

if (values.help) printUsageAndExit();
if (!values.prompt) printUsageAndExit("Missing required --prompt.");

const modelArg = values.model ?? "video";
const model = MODEL_ALIASES[modelArg] ?? modelArg;

const credentials = process.env.HF_CREDENTIALS;
if (!credentials) {
  console.error(
    "Missing HF_CREDENTIALS. Set it in .env.local as key-id:key-secret."
  );
  process.exit(1);
}

config({ credentials, maxPollTime: 15 * 60 * 1000 });

function buildInput(): Record<string, unknown> {
  const input: Record<string, unknown> = { prompt: values.prompt };

  if (IMAGE_MODELS.has(model)) {
    if (values.size) input.width_and_height = values.size;
    if (values.quality) input.quality = values.quality;
    if (values["batch-size"]) input.batch_size = Number(values["batch-size"]);
    return input;
  }

  input.duration = values.duration ? Number(values.duration) : 5;
  input.resolution = values.resolution ?? "720p";
  input.aspect_ratio = values["aspect-ratio"] ?? "16:9";
  return input;
}

async function main() {
  const result = await higgsfield.subscribe(model, {
    input: buildInput(),
    withPolling: true,
  });

  switch (result.status) {
    case "completed": {
      if (result.video?.url) {
        console.log("Video generated successfully:");
        console.log(result.video.url);
      } else if (result.images?.length) {
        console.log(`Generated ${result.images.length} image(s):`);
        for (const image of result.images) console.log(image.url);
      } else {
        console.error(
          "Request completed but no video or image URL was returned.",
          result
        );
        process.exit(1);
      }
      break;
    }
    case "failed":
      console.error("Generation failed:", result);
      process.exit(1);
      break;
    case "nsfw":
      console.error("Generation was blocked by content moderation:", result);
      process.exit(1);
      break;
    default:
      console.error(`Unexpected status "${result.status}":`, result);
      process.exit(1);
  }
}

main().catch((error) => {
  console.error("Request errored before completion:", error?.message ?? error);
  process.exit(1);
});
