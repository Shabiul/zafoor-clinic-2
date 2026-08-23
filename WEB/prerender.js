import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const privacySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": "https://zafoorclinic.com/#clinic",
      "name": "Zafoor Clinic",
      "alternateName": "Zafoor Skin, Hair, Laser & Diabetes Clinic",
      "url": "https://zafoorclinic.com/",
      "logo": "https://4pkrmvqtrlawvaa5.public.blob.vercel-storage.com/logo/zafoor-clinic-logo.png",
      "image": "https://4pkrmvqtrlawvaa5.public.blob.vercel-storage.com/images/hero/storefront.jpg",
      "telephone": "+918940399403",
      "email": "ZafoorClinic@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No 69/70, St. Xavier Street, Broadway, Sevenwells (Opposite Huda Mosque)",
        "addressLocality": "Broadway, Sevenwells, Chennai",
        "addressRegion": "Tamil Nadu",
        "postalCode": "600001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 13.0958,
        "longitude": 80.2891
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "18:00",
          "closes": "22:00"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://zafoorclinic.com/privacy-policy/#webpage",
      "url": "https://zafoorclinic.com/privacy-policy/",
      "name": "Privacy Policy | Zafoor Clinic",
      "description": "Privacy Policy for Zafoor Clinic explaining how personal information is collected, used, protected, and managed through the clinic website and services.",
      "isPartOf": {
        "@id": "https://zafoorclinic.com/#clinic"
      },
      "about": {
        "@id": "https://zafoorclinic.com/#clinic"
      },
      "inLanguage": "en-IN",
      "datePublished": "2026-08-21",
      "dateModified": "2026-08-21",
      "breadcrumb": {
        "@id": "https://zafoorclinic.com/privacy-policy/#breadcrumb"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://zafoorclinic.com/privacy-policy/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://zafoorclinic.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": "https://zafoorclinic.com/privacy-policy/"
        }
      ]
    }
  ]
};

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
  console.log("✨ [Prerender] 3/3 Rendering static HTML payloads for all routes...");
  const templatePath = path.resolve(__dirname, "dist/index.html");
  const baseTemplate = await fs.readFile(templatePath, "utf-8");

  const ssrBundlePath = path.resolve(__dirname, "dist-ssr/entry-server.js");
  const { render } = await import(pathToFileURL(ssrBundlePath).href);

  // 3a. Render Homepage ("/")
  const homeHtml = render("/");
  const finalHomeHtml = baseTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${homeHtml}</div>`
  );
  await fs.writeFile(templatePath, finalHomeHtml, "utf-8");
  const homeStats = await fs.stat(templatePath);
  console.log(
    `✅ [Prerender] dist/index.html generated (${(homeStats.size / 1024).toFixed(2)} KB)`
  );

  // 3b. Render Privacy Policy ("/privacy-policy/")
  const privacyHtml = render("/privacy-policy/");
  let privacyTemplate = baseTemplate
    .replace(
      /<title>.*?<\/title>/s,
      "<title>Privacy Policy | Zafoor Clinic</title>"
    )
    .replace(
      /<meta name="description" content=".*?">/s,
      '<meta name="description" content="Privacy Policy for Zafoor Clinic explaining how personal information is collected, used, protected, and managed through the clinic website and services.">'
    )
    .replace(
      /<link rel="canonical" href=".*?">/s,
      '<link rel="canonical" href="https://zafoorclinic.com/privacy-policy/">'
    )
    .replace(
      /<meta property="og:title" content=".*?">/s,
      '<meta property="og:title" content="Privacy Policy | Zafoor Clinic">'
    )
    .replace(
      /<meta property="og:description" content=".*?">/s,
      '<meta property="og:description" content="Privacy Policy for Zafoor Clinic explaining how personal information is collected, used, protected, and managed through the clinic website and services.">'
    )
    .replace(
      /<meta property="og:url" content=".*?">/s,
      '<meta property="og:url" content="https://zafoorclinic.com/privacy-policy/">'
    )
    .replace(
      /<meta name="twitter:title" content=".*?">/s,
      '<meta name="twitter:title" content="Privacy Policy | Zafoor Clinic">'
    )
    .replace(
      /<meta name="twitter:description" content=".*?">/s,
      '<meta name="twitter:description" content="Privacy Policy for Zafoor Clinic explaining how personal information is collected, used, protected, and managed through the clinic website and services.">'
    )
    .replace(
      /<script type="application\/ld\+json">.*?<\/script>/s,
      `<script type="application/ld+json">\n${JSON.stringify(privacySchema, null, 2)}\n</script>`
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${privacyHtml}</div>`
    );

  const privacyDir = path.resolve(__dirname, "dist/privacy-policy");
  await fs.mkdir(privacyDir, { recursive: true });
  const privacyFilePath = path.resolve(privacyDir, "index.html");
  await fs.writeFile(privacyFilePath, privacyTemplate, "utf-8");

  const privacyStats = await fs.stat(privacyFilePath);
  console.log(
    `✅ [Prerender] dist/privacy-policy/index.html generated (${(privacyStats.size / 1024).toFixed(2)} KB)`
  );

  // Clean up dist-ssr
  await fs.rm(path.resolve(__dirname, "dist-ssr"), { recursive: true, force: true });
  console.log("🎉 [Prerender] Build-Time Prerendering completed successfully!");
}

prerender().catch((err) => {
  console.error("❌ [Prerender] Error during prerendering:", err);
  process.exit(1);
});
