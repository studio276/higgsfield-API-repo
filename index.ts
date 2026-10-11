import { config as loadEnv } from "dotenv";
import { config, higgsfield } from "@higgsfield/client/v2";

loadEnv({ path: ".env.local" });

const credentials = process.env.HF_CREDENTIALS;
if (!credentials) {
  console.error(
    "Missing HF_CREDENTIALS. Set it in .env.local as key-id:key-secret."
  );
  process.exit(1);
}

config({ credentials });

async function main() {
  const result = await higgsfield.subscribe("bytedance/seedance-2.5/text-to-video", {
    input: {
      prompt: "A cinematic scene at sunset",
      duration: 5,
      resolution: "720p",
      aspect_ratio: "16:9",
    },
    withPolling: true,
  });

  switch (result.status) {
    case "completed": {
      const videoUrl = result.video?.url;
      if (!videoUrl) {
        console.error("Request completed but no video URL was returned.", result);
        process.exit(1);
      }
      console.log("Video generated successfully:");
      console.log(videoUrl);
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
