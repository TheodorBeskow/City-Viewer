const puppeteer = require("puppeteer");
const EXT = '../../../../../../Scraper\\EXT' // Probably vary bad solution

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      // settings for browser
      headless: false,
      args: [
        "--disable-setuid-sandbox",
        `--disable-extensions-except=${EXT}`,
        `--load-extension=${EXT}`,
        `--enable-automation`,
      ],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
}

module.exports = {
  startBrowser,
};
