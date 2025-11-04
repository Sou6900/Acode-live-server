// build.js 
import { build } from "esbuild";
import fs from "fs";
import archiver from "archiver";

// reusable build function
async function bundle() {
  await build({
    entryPoints: ["src/main.js"],
    bundle: true,
    outfile: "dist/main.js",
    format: "iife",
    minify: false,
    sourcemap: false,
  });

  console.log("✅ esbuild bundle done -> dist/main.js");

  // zip বানাও
  const output = fs.createWriteStream("dist.zip");
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);

  archive.file("dist/main.js", { name: "main.js" });
  archive.file("plugin.json", { name: "plugin.json" });
  archive.file("icon.png", { name: "icon.png" });

  await archive.finalize();
  console.log("📦 dist.zip created\n");
}

// first build once
await bundle();

// now watch for file changes
const watcher = fs.watch("src", { recursive: true }, async (event, filename) => {
  if (filename && /\.(js|css|json)$/i.test(filename)) {
    console.log(`Detected change in ${filename}, rebuilding...`);
    await bundle();
  }
});
