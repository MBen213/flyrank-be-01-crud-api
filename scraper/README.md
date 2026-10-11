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
