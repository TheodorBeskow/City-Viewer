const pageScraper = require("./CityScraper");

async function scrapeAll(browserInstance, country) {
  let browser;
  try {
    browser = await browserInstance;

    // Geonames
    await pageScraper.scraper(
      browser,
      `Countries/${country}`,
      country,
      "0"
    );
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance, country) => scrapeAll(browserInstance, country);
