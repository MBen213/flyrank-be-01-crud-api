
const fs = require("node:fs/promises");
const path = require("node:path");
const cheerio = require("cheerio");

const START_URL = "https://books.toscrape.com/";
const CACHE_DIR = path.join(__dirname, "..", "cache");
const USER_AGENT =
  "FlyRankPoliteScraper/1.0 (+https://github.com/MBen213)";

const MAX_PAGES = 3;
const REQUEST_DELAY_MS = 500;

function cacheFileForPage(pageNumber) {
  const filename =
    pageNumber === 1
      ? "catalogue-page-1.html"
      : `catalogue-page-${pageNumber}.html`;

  return path.join(CACHE_DIR, filename);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadHtml(url, pageNumber, lastRequestTime) {
  const cacheFile = cacheFileForPage(pageNumber);

  try {
    const html = await fs.readFile(cacheFile, "utf8");

    console.log(`CACHE HIT page ${pageNumber}`);
    return { html, lastRequestTime };
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  if (lastRequestTime !== null) {
    const elapsed = Date.now() - lastRequestTime;
    const remainingDelay = REQUEST_DELAY_MS - elapsed;

    if (remainingDelay > 0) {
      await sleep(remainingDelay);
    }
  }

  console.log(`FETCH page ${pageNumber}: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (response.status !== 200) {
    throw new Error(
      `Unexpected HTTP status ${response.status} for ${url}`
    );
  }

  const html = await response.text();

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cacheFile, html, "utf8");

  console.log(
    `Saved page ${pageNumber}: ${Buffer.byteLength(html, "utf8")} bytes`
  );

  return { html, lastRequestTime: Date.now() };
}

async function main() {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const allBooks = [];
  const seenUrls = new Set();
  let currentUrl = START_URL;
  let lastRequestTime = null;
  let pagesProcessed = 0;

  while (currentUrl && pagesProcessed < MAX_PAGES) {
    const pageNumber = pagesProcessed + 1;
    const result = await loadHtml(
      currentUrl,
      pageNumber,
      lastRequestTime
    );

    lastRequestTime = result.lastRequestTime;

    const $ = cheerio.load(result.html);

    $("article.product_pod h3 a").each((_, element) => {
      const href = $(element).attr("href");

      if (!href) {
        return;
      }

      const productUrl = new URL(href, currentUrl).href;

      if (seenUrls.has(productUrl)) {
        return;
      }

      seenUrls.add(productUrl);

      allBooks.push({
        title:
          $(element).attr("title")?.trim() ||
          $(element).text().trim(),
        product_url: productUrl,
        source_page: currentUrl,
      });
    });

    pagesProcessed += 1;

    const nextHref = $("li.next a").attr("href");
    currentUrl = nextHref
      ? new URL(nextHref, currentUrl).href
      : null;
  }

  console.log("\nCatalogue discovery summary");
  console.log(`Catalogue pages processed: ${pagesProcessed}`);
  console.log(`Books discovered: ${allBooks.length}`);
  console.log(`Unique URLs: ${seenUrls.size}`);

  console.log("\nFirst 3 books:");
  console.log(JSON.stringify(allBooks.slice(0, 3), null, 2));

  if (pagesProcessed !== MAX_PAGES) {
    throw new Error(
      `Expected ${MAX_PAGES} catalogue pages, processed ${pagesProcessed}`
    );
  }

  if (allBooks.length !== 60 || seenUrls.size !== 60) {
    throw new Error(
      `Expected 60 unique books, found ${allBooks.length} books and ${seenUrls.size} unique URLs`
    );
  }
}

main().catch((error) => {
  console.error(`Catalogue discovery failed: ${error.message}`);
  process.exitCode = 1;
});
