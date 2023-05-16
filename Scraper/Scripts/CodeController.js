const pageScraper = require("./CodeScraper");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;

    // Geonames
    await pageScraper.scraper(
      browser,
      "Scraper/CountryCodes",
    );
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
