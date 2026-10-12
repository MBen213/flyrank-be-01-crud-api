<WritingBlock id="58314" variant="document"># BE-05 - The Polite Scraper

1. Target classification

Target: Books to Scrape

Classification: A demonstration website designed for practicing web scraping. The homepage explicitly identifies the site as a demo website for scraping purposes.

Why this target: It provides a catalogue of books with visible titles, prices, availability, ratings, and individual product pages. This makes it suitable for practicing HTML parsing, data normalization, validation, and error handling.

2. Scope

This project will process only the first three catalogue pages and visit the book product pages discovered from those pages.

The expected catalogue contains 60 unique book URLs across these three pages.

3. Data to collect

Each book record will contain these raw fields:

- title
- product_url
- price_text
- availability_text
- rating_text
- description
- source_page
- fetched_at

The normalized record will also include price_gbp as a numeric value.

4. Robots.txt check

URL: https://books.toscrape.com/robots.txt

Observed result: HTTP 404 Not Found when checked manually in the browser on 11 October 2026.

Interpretation: No robots.txt file was found at this URL. This result is not permission to scrape without limits. The scraper will remain limited to the stated scope and will use a descriptive User-Agent, request timeouts, caching, and delays between real requests.

5. Polite scraping principles

- Identify the scraper with a descriptive User-Agent.
- Use request timeouts and check HTTP status codes.
- Wait at least 500 milliseconds between real requests.
- Cache downloaded HTML and reuse it during development.
- Collect only the fields required by the assignment.
- Validate scraped data before writing it to the final output.
- Record failures honestly and preserve successfully processed records.

I will not reuse this code on another site without checking its rules and terms first.

6. Planned pipeline

Fetch -> Extract -> Normalize -> Validate -> Store -> Report

7. Ethics and limitations

Scraped content is treated as untrusted input. If an official API is available for a future target, it should be preferred. This project will not bypass logins, paywalls, or access restrictions.

The scraper will use ordinary HTTP requests and HTML parsing because the target catalogue provides the data in the server-delivered HTML. A browser automation tool is not required for the core catalogue pipeline.</WritingBlock>

 8. Implementation Status

The scraper implementation is complete for the current three-page scope.

The pipeline discovers catalogue entries, fetches individual product pages, extracts book details, and writes JSON output files.

### Implemented Components

- `src/catalogue.js` — discovers unique book URLs from the first three catalogue pages.
- `src/book-details.js` — fetches and caches product pages, extracts book details, converts `price_text` into numeric `price_gbp`, and validates required fields and prices.
- `src/index.js` — orchestrates the scraping run, records errors, and generates the run report.
- `test/book-details.test.js` — tests book-detail extraction and missing-title validation.

## 9. Output Files

The scraper generates these files in the `output/` directory:

| File | Purpose |
|---|---|
| `books.json` | Successfully extracted book records |
| `errors.json` | Errors encountered during extraction |
| `run-report.json` | Run statistics, duration, and success status |

The generated output and cached HTML are excluded from version control.

## 10. Validation and Test Results

The latest verified run produced the following results:

- Catalogue pages processed: 3
- Books discovered: 60
- Unique product URLs: 60
- Books extracted: 60
- Extraction errors: 0
- Missing titles: 0
- Missing prices: 0
- Missing prices: 0
- Missing `price_gbp` values: 0
- Invalid `price_gbp` values: 0
- Automated tests: 3 passed, 0 failed

These results describe the latest verified run and may differ if the source website changes.

## 11. Running the Scraper

From the `scraper` directory, run:

```bash
node src/index.js
```

To run the tests:

```bash
node --test
```

The scraper reuses cached HTML when available, so subsequent runs may finish much faster than the initial run.
