import { build } from "esbuild";
import fs from "fs";
import archiver from "archiver";
import path from "path";

const color = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  underline: "\x1b[4m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

// CLI / env flag
const args = process.argv.slice(2);
const WATCH = args.includes("--watch") || process.env.WATCH === "1";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const version = pkg.version || "0.0.0";
const zipName = `liveserver-v${version}.zip`;

let isBuilding = false;
let debounceTimer;

async function bundle() {
  if (isBuilding) return;
  isBuilding = true;

  console.log(`${color.cyan}Building...${color.reset}`);

  try {
    await build({
      entryPoints: ["src/main.js"],
      bundle: true,
      outfile: "dist/main.js",
      format: "iife",
      minify: false,
      sourcemap: false,
    });

    console.log(`${color.green}✅ esbuild bundle done → dist/main.js${color.reset}`);

    // remove old zip
    if (fs.existsSync(zipName)) fs.unlinkSync(zipName);

    // prepare archive
    const output = fs.createWriteStream(zipName);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);

    // files to include
    archive.file("dist/main.js", { name: "main.js" });
    if (fs.existsSync("plugin.json")) archive.file("plugin.json", { name: "plugin.json" });
    if (fs.existsSync("icon.png")) archive.file("icon.png", { name: "icon.png" });

    // wait for finalize + stream close (attach listeners BEFORE finalize)
    await new Promise((resolve, reject) => {
      output.on("close", resolve);
      output.on("end", resolve);
      output.on("error", reject);
      archive.on("error", reject);

      archive.finalize().catch(reject);
    });

    const sizeKB = (fs.statSync(zipName).size / 1024).toFixed(1);
    console.log(
      `📦 ${color.yellow}${color.underline}${color.bold}${zipName}${color.reset} created ${color.yellow}${color.bold}(${sizeKB} KB)${color.reset}\n`
    );
  } catch (err) {
    console.error(`${color.magenta}❌ Build failed: ${err.message}${color.reset}`);
  } finally {
    isBuilding = false;
  }
}

(async () => {
  // build once immediately
  await bundle();

  if (WATCH) {
    console.log(`${color.dim}  Watching for file changes in src/...${color.reset}`);

    // small debounce to avoid multiple builds
    fs.watch("src", { recursive: false }, (event, filename) => {
      if (!filename) return;
      if (!/\.(js|css|json)$/i.test(filename)) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log(`${color.bold}Detected change in ${filename}${color.reset}`);
        await bundle();
      }, 500);
    });

    // keep process alive
  } else {
    // exit after single build
    process.exit(0);
  }
})();
