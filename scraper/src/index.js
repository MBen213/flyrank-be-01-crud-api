
const fs = require("node:fs/promises");
const path = require("node:path");

const CATALOGUE_URL = "https://books.toscrape.com/";
const CACHE_DIR = path.join(__dirname, "..", "cache");
const CACHE_FILE = path.join(CACHE_DIR, "catalogue-page-1.html");

const USER_AGENT =
  "FlyRankPoliteScraper/1.0 (+https://github.com/MBen213)";

async function main() {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  try {
    const cachedHtml = await fs.readFile(CACHE_FILE, "utf8");

    console.log("CACHE HIT");
    console.log(`Source: ${CATALOGUE_URL}`);
    console.log(`HTML size: ${Buffer.byteLength(cachedHtml, "utf8")} bytes`);
    return;
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  console.log("FETCH");
  console.log(`URL: ${CATALOGUE_URL}`);

  const response = await fetch(CATALOGUE_URL, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (response.status !== 200) {
    throw new Error(`Unexpected HTTP status: ${response.status}`);
  }

  const html = await response.text();

  await fs.writeFile(CACHE_FILE, html, "utf8");

  console.log(`HTTP status: ${response.status}`);
  console.log(`HTML size: ${Buffer.byteLength(html, "utf8")} bytes`);
  console.log(`Saved to: ${CACHE_FILE}`);
}

main().catch((error) => {
  console.error(`Scraper failed: ${error.message}`);
  process.exitCode = 1;
});
