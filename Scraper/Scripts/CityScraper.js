const fs = require("fs");

const sleep = ms => new Promise(r => setTimeout(r, ms*1000))

const scraperObject = {
  url1: "https://www.geonames.org/advanced-search.html?q=&country=",
  url2: "&featureClass=P&startRow=",
  async scraper(browser, toSave, CountryCode) {
    let page = await browser.newPage();
    let CountryCityList = [];
    let FoundEnd = false;
    
    //
    for(let CountryIndex = 0; CountryIndex<=5000 && !FoundEnd; CountryIndex+=50){
      console.log(`Navigating to ${this.url1}${CountryCode}${this.url2}${CountryIndex}`);

      await page.goto(`${this.url1}${CountryCode}${this.url2}${CountryIndex}`, {waitUntil: "domcontentloaded"});
      // Wait for the required DOM to be rendered
  
      for(let city = 3; city < 53; city++){
        // console.log(city);
        try{
          await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+(city+1).toString()+']', {timeout: 1000})
        }catch{
          console.log("End of Cities:", CountryIndex+city-2);
          FoundEnd = true;
          break
        }
        
        let hasPopulation = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[4]')
        let popText = await page.evaluate((hasPopulation) => {return hasPopulation.textContent}, hasPopulation);
        var hasPop = popText.includes("population");

        try{
          await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]/a', {timeout: 1000});
        } catch {
          console.log("City has no country:", CountryIndex+city-2);
          continue;
        }
        
        let name = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[2]/a')
        let country = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]/a')
        try{
          var province = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]/text()', {timeout: 1000})
        } catch {
          console.log("Province set to country:", CountryIndex+city-2);
          province = country
        }
        let population = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+(hasPop?']/td[4]/small':']/td[3]'))
        let lat = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[2]/span/span[1]')
        let long = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[2]/span/span[2]')
        let cityData = await page.evaluate((name, country, province, population, lat, long) => {
          return {
            "name" : name.textContent,
            "country" : country.textContent,
            "province" : province.textContent,
            "population" : population.textContent,
            "latitude" : parseFloat(lat.textContent),
            "longitude" : parseFloat(long.textContent),
          };
        }, name, country, province, population, lat, long);
        if(cityData["province"]!=cityData["country"]) cityData["province"] = cityData["province"].substring(2);
        if(cityData["province"].length == 0) {
          cityData["province"] = cityData["country"]
          console.log("Province length = 0 now set to", cityData["country"])
        }
        if(hasPop){
          cityData["population"] = cityData["population"].substring(11);
          let splitIndex = cityData["population"].indexOf(' ');
          if(splitIndex != -1){
            cityData["population"] = cityData["population"].substring(0, splitIndex-1);
          }
          cityData["population"] = cityData["population"].replace(/,/g, "");
          cityData["population"] = parseInt(cityData["population"]);
        }else cityData["population"] = -1;

        //console.log(cityData) 
        CountryCityList.push(cityData);
      }
      
      let randomTime = Math.random() * (0.3 - 0.05) + 0.05;
      console.log("Sleep for", randomTime, "seconds at end of page", CountryIndex/50+1)
      await sleep(randomTime)
    }
    console.log(toSave);
    fs.writeFile(
      `${toSave}.json`,
      // `${toSave.split("/").join("-")}.json`,
      JSON.stringify(CountryCityList),
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

    await page.close();
  },
};

module.exports = scraperObject;
