const fs = require("node:fs/promises");
const path = require("node:path");

const { discoverBooks } = require("./catalogue");
const {
  fetchProductHtml,
  extractBookDetails,
} = require("./book-details");

const OUTPUT_DIR = path.join(__dirname, "..", "output");
const SOURCE_URL = "https://books.toscrape.com/";

async function main() {
  const startedAt = new Date();
  const startTime = Date.now();

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const discoveredBooks = await discoverBooks();
  const books = [];
  const errors = [];

  console.log(
    `\nExtracting details for ${discoveredBooks.length} books...`
  );

  for (let i = 0; i < discoveredBooks.length; i += 1) {
    const item = discoveredBooks[i];

    console.log(`\n[${i + 1}/${discoveredBooks.length}] ${item.title}`);

    try {
      const html = await fetchProductHtml(item.product_url);
      const details = extractBookDetails(
        html,
        item.product_url,
        item.source_page
      );

      books.push(details);
    } catch (error) {
      console.error(`ERROR: ${error.message}`);

      errors.push({
        title: item.title,
        product_url: item.product_url,
        source_page: item.source_page,
        error: error.message,
        occurred_at: new Date().toISOString(),
      });
    }
  }

  const finishedAt = new Date();
  const durationSeconds = Number(
    ((Date.now() - startTime) / 1000).toFixed(2)
  );

  const runReport = {
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    duration_seconds: durationSeconds,
    source_url: SOURCE_URL,
    catalogue_pages_expected: 3,
    books_discovered: discoveredBooks.length,
    books_extracted: books.length,
    errors_count: errors.length,
    success: errors.length === 0 && books.length === discoveredBooks.length,
    output_files: [
      "books.json",
      "errors.json",
      "run-report.json",
    ],
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, "books.json"),
    JSON.stringify(books, null, 2),
    "utf8"
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "errors.json"),
    JSON.stringify(errors, null, 2),
    "utf8"
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "run-report.json"),
    JSON.stringify(runReport, null, 2),
    "utf8"
  );

  console.log("\nScraping summary");
  console.log(`Books discovered: ${runReport.books_discovered}`);
  console.log(`Books extracted: ${runReport.books_extracted}`);
  console.log(`Errors: ${runReport.errors_count}`);
  console.log(`Duration: ${runReport.duration_seconds} seconds`);
  console.log(`Success: ${runReport.success}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Scraper failed: ${error.message}`);
    process.exitCode = 1;
  });
}