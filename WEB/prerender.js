import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  console.log("🚀 [Prerender] Starting Build-Time Prerendering for Zafoor Clinic...");

  // 1. Client build
  console.log("📦 [Prerender] 1/3 Building client assets with Vite...");
  await build({
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  });

  // 2. SSR build
  console.log("⚙️ [Prerender] 2/3 Building SSR bundle...");
  await build({
    publicDir: false,
    build: {
      ssr: "src/entry-server.jsx",
      outDir: "dist-ssr",
      emptyOutDir: true,
      copyPublicDir: false,
    },
  });

  // 3. Render HTML
  console.log("✨ [Prerender] 3/3 Rendering static HTML payload...");
  const templatePath = path.resolve(__dirname, "dist/index.html");
  const template = await fs.readFile(templatePath, "utf-8");

  const ssrBundlePath = path.resolve(__dirname, "dist-ssr/entry-server.js");
  const { render } = await import(pathToFileURL(ssrBundlePath).href);

  const appHtml = render();

  // Inject rendered HTML into #root
  const finalHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  await fs.writeFile(templatePath, finalHtml, "utf-8");

  // Clean up dist-ssr
  await fs.rm(path.resolve(__dirname, "dist-ssr"), { recursive: true, force: true });

  const stats = await fs.stat(templatePath);
  console.log(
    `✅ [Prerender] Complete! Prerendered HTML generated at dist/index.html (${(stats.size / 1024).toFixed(2)} KB)`
  );
}

prerender().catch((err) => {
  console.error("❌ [Prerender] Error during prerendering:", err);
  process.exit(1);
});
