
const test = require("node:test");
const assert = require("node:assert/strict");

const { extractBookDetails } = require("../src/book-details");

const productUrl =
  "https://books.toscrape.com/catalogue/test-book_1/index.html";

const sourcePage = "https://books.toscrape.com/";

const sampleHtml = `
<!DOCTYPE html>
<html>
  <body>
    <article class="product_page">
      <div class="product_main">
        <h1>Test Book</h1>
        <p class="price_color">£12.99</p>
        <p class="availability">
          <i class="icon-ok"></i>
          In stock (5 available)
        </p>
        <p class="star-rating Three">
          <i class="icon-star"></i>
        </p>
      </div>
      <div id="product_description">
        <h2>Product Description</h2>
      </div>
      <p>A sample description for testing.</p>
    </article>
  </body>
</html>
`;

test("extracts the expected book fields", () => {
  const book = extractBookDetails(
    sampleHtml,
    productUrl,
    sourcePage
  );

  assert.equal(book.title, "Test Book");
  assert.equal(book.product_url, productUrl);
  assert.equal(book.price_text, "£12.99");
  assert.match(book.availability_text, /In stock/);
  assert.match(book.rating_text, /Three/);
  assert.equal(
    book.description,
    "A sample description for testing."
  );
  assert.equal(book.source_page, sourcePage);

  assert.ok(
    !Number.isNaN(Date.parse(book.fetched_at)),
    "fetched_at should be a valid date"
  );
});

test("throws when the title is missing", () => {
  const htmlWithoutTitle = sampleHtml.replace(
    "<h1>Test Book</h1>",
    ""
  );

  assert.throws(
    () =>
      extractBookDetails(
        htmlWithoutTitle,
        productUrl,
        sourcePage
      ),
    /Missing book title/
  );
});
