
const fs = require("node:fs/promises");
const path = require("node:path");
const cheerio = require("cheerio");

const CACHE_DIR = path.join(__dirname, "..", "cache");
const USER_AGENT =
  "FlyRankPoliteScraper/1.0 (+https://github.com/MBen213)";

const REQUEST_DELAY_MS = 500;
const TIMEOUT_MS = 10000;

let lastRequestTime = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function getCacheFile(productUrl) {
  const url = new URL(productUrl);
  const slug = url.pathname
    .split("/")
    .filter(Boolean)
    .slice(-2)
    .join("-")
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  return path.join(CACHE_DIR, `${slug}.html`);
}


async function fetchProductHtml(productUrl) {
  const cacheFile = getCacheFile(productUrl);

  try {
    const cachedHtml = await fs.readFile(cacheFile, "utf8");
    console.log(`CACHE HIT: ${productUrl}`);
    return cachedHtml;
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  if (lastRequestTime !== null) {
    const elapsed = Date.now() - lastRequestTime;
    const remaining = REQUEST_DELAY_MS - elapsed;

    if (remaining > 0) {
      await sleep(remaining);
    }
  }

  console.log(`FETCH: ${productUrl}`);

  const response = await fetch(productUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  lastRequestTime = Date.now();

  if (response.status !== 200) {
    throw new Error(
      `Unexpected HTTP status ${response.status} for ${productUrl}`
    );
  }

  const html = await response.text();

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cacheFile, html, "utf8");

  console.log(
    `Cached ${Buffer.byteLength(html, "utf8")} bytes`
  );

  return html;
}

function extractBookDetails(html, productUrl, sourcePage) {
  const $ = cheerio.load(html);

  const title = $("div.product_main h1").first().text().trim();

  const priceText = $("div.product_main .price_color")
    .first()
    .text()
    .trim();

  const availabilityText = $("div.product_main .availability")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const ratingText =
    $("div.product_main p.star-rating").attr("class") || "";

  const descriptionElement = $("#product_description").next("p");

  const description = descriptionElement.length
    ? descriptionElement.text().replace(/\s+/g, " ").trim() || null
    : null;

  if (!title) {
    throw new Error(`Missing book title: ${productUrl}`);
  }

  if (!priceText) {
    throw new Error(`Missing book price: ${productUrl}`);
  }

  if (!availabilityText) {
    throw new Error(`Missing availability: ${productUrl}`);
  }

  return {
    title,
    product_url: new URL(productUrl).href,
    price_text: priceText,
    availability_text: availabilityText,
    rating_text: ratingText,
    description,
    source_page: sourcePage,
    fetched_at: new Date().toISOString(),
  };
}

async function main() {
  const productUrl =
    "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html";

  const sourcePage = "https://books.toscrape.com/";
 
  const html = await fetchProductHtml(productUrl);
  const book = extractBookDetails(html, productUrl, sourcePage);

  console.log("\nExtracted book details:");
  console.log(JSON.stringify(book, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Book extraction failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  extractBookDetails,
  fetchProductHtml,
};
