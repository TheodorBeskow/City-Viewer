const fs = require("fs");

const scraperObject = {
  url: "https://www.geonames.org/countries/",
  async scraper(browser, sortiment) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    await page.goto(`${this.url}`, {waitUntil: "domcontentloaded"});
    // Wait for the required DOM to be rendered
    const list = [];

    
    for(let index = 1; ;index++){
      try{
        var elementCC = await page.waitForXPath('//*[@id="countries"]/tbody/tr['+ index.toString() +']/td[1]', {timeout: 3000});
        var elementName = await page.waitForXPath('//*[@id="countries"]/tbody/tr['+ index.toString() +']/td[5]', {timeout: 3000});
        var elementArea = await page.waitForXPath('//*[@id="countries"]/tbody/tr['+ index.toString() +']/td[7]', {timeout: 3000});
        var elementPopulation = await page.waitForXPath('//*[@id="countries"]/tbody/tr['+ index.toString() +']/td[8]', {timeout: 3000});
        var elementContinent = await page.waitForXPath('//*[@id="countries"]/tbody/tr['+ index.toString() +']/td[9]', {timeout: 3000});
        
        let countryData = await page.evaluate((elementCC, elementName, elementArea, elementPopulation, elementContinent) => {
          return{
            "CountryCode" : elementCC.textContent,
            "CountryName" : elementName.textContent,
            "CountryArea" : elementArea.textContent,
            "CountryPopulation" : elementPopulation.textContent,
            "CountryContinent" : elementContinent.textContent
          };
        }, elementCC, elementName, elementArea, elementPopulation, elementContinent);  
        countryData["CountryArea"] = countryData["CountryArea"].replace(/,/g, "");
        countryData["CountryPopulation"] = countryData["CountryPopulation"].replace(/,/g, "");
        countryData["CountryArea"] = parseFloat(countryData["CountryArea"]);
        countryData["CountryPopulation"] = parseInt(countryData["CountryPopulation"]);
        // console.log(countryData);
        list.push(countryData);

      }catch{
        break;
      }
    }


    fs.writeFile(
      `${sortiment.split(" ").join("-")}.json`,
      JSON.stringify(list),
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

    await page.close();
  },
};


module.exports = scraperObject;
