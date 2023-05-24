const fs = require("fs");

const sleep = ms => new Promise(r => setTimeout(r, ms*1000))

var page;
const cityList = [];
const MIN_POPULATION = 10000000;
var amount = 0, countryIndex = 0;

async function processCountry(name){
  country = require(`../Countries/${name}`);
      let restPopulation = countries[countryIndex]["CountryPopulation"];
      let citiesInCountry = 0;
      for(let city = 0; city < country.length; city++){
        if(country[city]["population"] < MIN_POPULATION) continue;
        amount++; citiesInCountry++;
        restPopulation = Math.max(0, restPopulation-country[city]["population"]);
      }
      for(let city = 0; city < country.length; city++){
        if(country[city]["population"] < MIN_POPULATION) continue;
        
        console.log(country[city]["name"]);
        console.log(country[city]["latitude"]);
        console.log(country[city]["longitude"]);

        while(true){
          // input lat and long
          const [lat] = await page.$x('//*[@id="lat"]');
          if (lat) await lat.type(country[city]["latitude"].toString());
          const [long] = await page.$x('//*[@id="lng"]');
          if (long) await long.type(country[city]["longitude"].toString());
          
          await sleep(0.1);
          // click search
          let [button] = await page.$x('//*[@id="insertPoint"]');
          await button.click();
          
          // retreve height
          try{
            var retrevedHeight = await page.waitForXPath('//*[@id="outputDiv"]/strong', {timeout: 3000});
            break;
          }catch{
            await page.reload();
            await sleep(0.5);
          }
        }
        let heightData = await page.evaluate(retrevedHeight => {
          return retrevedHeight.textContent;
        }, retrevedHeight);
        let endOfHeight;
        for(endOfHeight = 0; heightData[endOfHeight] != ' '; endOfHeight++)  
        cityList.push({
          "name": country[city]["name"],
          "country": country[city]["country"],
          "province": country[city]["province"],
          "population": country[city]["population"]+restPopulation/citiesInCountry,
          "latitude": country[city]["latitude"],
          "longitude": country[city]["longitude"],
          "height": heightData.substring(endOfHeight)
        })

        // wait random time between 0.5 and 1.00
        let randomTime = Math.random() * 0.5 + 0.5;
        console.log("Sleep for", randomTime, "seconds at query ___");
        await sleep(randomTime);
      }
      countryIndex++;
}

const scraperObject = {
  url: "https://www.advancedconverter.com/map-tools/find-altitude-by-coordinates",
  // url: "https://www.freemaptools.com/elevation-finder.htm",
  async scraper(browser, toSave) {

    page = await browser.newPage();
    console.log(`Navigating to ${this.url}`);

    await page.goto(`${this.url}`, {waitUntil: "domcontentloaded"});
    // Wait for the required DOM to be rendered
    
    await sleep(1);

    countries = require(`../CountryCodes`);
    const countryFiles = fs.readdirSync('Scraper/Countries');
    for(let name of countryFiles){
     await processCountry(name); 
    }
    console.log(amount,"heights of cities scraped");

  
    console.log(toSave);
    fs.writeFile(
      `${toSave}.json`,
      // `${toSave.split("/").join("-")}.json`,
      JSON.stringify(cityList),
      "utf8",
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(
          `The data has been scraped and saved successfully! View it at './${toSave}.json'`
        );
      }
    );

    await browser.close();
  },
};

module.exports = scraperObject;
