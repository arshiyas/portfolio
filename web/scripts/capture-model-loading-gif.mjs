import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const framesDir = join(root, ".capture-frames");
const outGif = join(root, "public/projects/days-in-canada-model-loading.gif");
const chromePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const captureHtml = join(root, "scripts/capture/model-loading.html");
const captureUrl = `file://${captureHtml}`;

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
await mkdir(dirname(outGif), { recursive: true });

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

// Hold early/mid/end frames a bit longer for readability.
const frameFiles = [];
const frameArgs = [];
for (let i = 0; i < 8; i += 1) {
  const file = join(framesDir, `frame-${String(i).padStart(2, "0")}.png`);
  frameFiles.push(file);
  const delay = i === 0 || i === 7 ? 90 : 45; // centiseconds
  frameArgs.push("-delay", String(delay), file);
}

const paletteFile = join(framesDir, "palette.png");
await run("magick", [...frameFiles, "-append", "-unique-colors", "-colors", "64", paletteFile]);

await run("magick", [
  ...frameArgs,
  "-remap",
  paletteFile,
  "-loop",
  "0",
  "-layers",
  "Optimize",
  outGif,
]);

await writeFile(
  join(framesDir, "done.txt"),
  `Wrote ${outGif}\n`,
  "utf8",
);

console.log(`GIF written to ${outGif}`);
