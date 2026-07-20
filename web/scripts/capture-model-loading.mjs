import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const framesDir = join(root, ".capture-frames");
const seqDir = join(framesDir, "sequence");
const outMp4 = join(root, "public/projects/days-in-canada-model-loading.mp4");
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const captureHtml = join(root, "scripts/capture/model-loading.html");
const captureUrl = `file://${captureHtml}`;

// Hold first/last frames longer so status text is readable.
const frameHolds = [24, 12, 12, 12, 24];
const fps = 12;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });
await mkdir(seqDir, { recursive: true });
await mkdir(dirname(outMp4), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--hide-scrollbars", "--window-size=780,640"],
  defaultViewport: { width: 780, height: 640, deviceScaleFactor: 2 },
});

try {
  const page = await browser.newPage();
  await page.goto(captureUrl, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof window.__setStage === "function");
  const stageCount = await page.evaluate(() => window.__stageCount);

  for (let i = 0; i < stageCount; i += 1) {
    await page.evaluate((index) => window.__setStage(index), i);
    await new Promise((r) => setTimeout(r, 120));
    const file = join(framesDir, `frame-${String(i).padStart(2, "0")}.png`);
    const el = await page.$("#capture");
    await el.screenshot({ path: file, type: "png" });
  }
} finally {
  await browser.close();
}

let seq = 0;
for (let i = 0; i < frameHolds.length; i += 1) {
  const source = join(framesDir, `frame-${String(i).padStart(2, "0")}.png`);
  for (let h = 0; h < frameHolds[i]; h += 1) {
    const target = join(seqDir, `seq-${String(seq).padStart(4, "0")}.png`);
    await copyFile(source, target);
    seq += 1;
  }
}

if (!ffmpegPath) {
  throw new Error("ffmpeg-static binary not found");
}

await run(ffmpegPath, [
  "-y",
  "-framerate",
  String(fps),
  "-i",
  join(seqDir, "seq-%04d.png"),
  "-c:v",
  "libx264",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  outMp4,
]);

await writeFile(join(framesDir, "done.txt"), `Wrote ${outMp4}\n`, "utf8");
console.log(`MP4 written to ${outMp4}`);
