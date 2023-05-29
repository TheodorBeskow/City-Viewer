const fs = require("fs");

const sleep = ms => new Promise(r => setTimeout(r, ms*1000))

var page;
const cityList = [];
const MIN_POPULATION = 10000000;
// const MIN_POPULATION = 50000;
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

    await page.focus('#earth_elevation_calculator_gps');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    
    // input lat and long
    const [pos] = await page.$x('//*[@id="earth_elevation_calculator_gps"]');
    if (pos) await pos.type(country[city]["latitude"].toString()+", "+country[city]["longitude"].toString());
    
    await sleep(0.1);
    
    // click search
    const submitButton = await page.$x('//*[@id="earth_elevation_calculator"]/button');
    await submitButton[0].click();
    
    while(true){
      // retreve height
      await sleep(0.1);
      try{
        var heightData = await page.waitForXPath('//*[@id="results"]/div[2]', {timeout: 3000});
      }catch{
        console.log("Could not find output field! Trying again!")
        continue;
      }
      cityList.push({
        "name": country[city]["name"],
        "country": country[city]["country"],
        "province": country[city]["province"],
        "population": country[city]["population"]+restPopulation/citiesInCountry,
        "latitude": country[city]["latitude"],
        "longitude": country[city]["longitude"],
        "height": heightData.textContent
      })
      break;
    }
    
    
    // wait random time between 0.5 and 1.00
    let randomTime = Math.random() * 0.5 + 0.5;
    console.log("Sleep for", randomTime, "seconds at query ___");
    await sleep(randomTime);
  }
  countryIndex++;
}

const scraperObject = {
  // url: "https://www.advancedconverter.com/map-tools/find-altitude-by-coordinates",
  // url: "https://www.freemaptools.com/elevation-finder.htm",

  // blev blockad på denna sida   v
  url: "https://www.dcode.fr/earth-elevation",
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
      fs.writeFile(
        `${toSave}.json`,
        JSON.stringify(cityList),
        "utf8",
        function (err) {
          if (err) {
            return console.log(err);
          }
          console.log(
            `Data Saved at './${toSave}.json after scraping ${name}!'`
            );
          }
          );
    }
    console.log(amount,"heights of cities scraped");
    // await sleep(5);
    
    
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
    