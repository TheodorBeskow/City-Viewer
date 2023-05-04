const fs = require("fs");

const scraperObject = {
  url: "https://www.geonames.org/advanced-search.html?q=&country=CS&featureClass=P&continentCode=",
  async scraper(browser, sortiment) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    await page.goto(`${this.url}`, {waitUntil: "domcontentloaded"});
    // Wait for the required DOM to be rendered

    // get list of all coutries short name
    var elements = await page.waitForXPath('//*[@id="search"]/form/select')
    
    let countries = await page.evaluate(elements => {
      const list = [];
      let notUse = 2;
      for(const element of elements){
        if(notUse) {
          notUse--;
          continue;
        }
        try{
          list.push(element.getAttribute("value"));
        } catch{}
      }
      console.log(list);

      return list;
    }, elements);

    fs.writeFile(
      `${sortiment.split("/").join("-")}.json`,
      JSON.stringify(countries),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(
          `The data has been scraped and saved successfully! View it at './${sortiment}.json'`
        );
      }
    );

    // await page.close();
  },
};


module.exports = scraperObject;
