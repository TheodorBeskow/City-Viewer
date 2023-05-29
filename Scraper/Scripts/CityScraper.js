const fs = require("fs");

// function to sleep ms seconds
const sleep = ms => new Promise(r => setTimeout(r, ms*1000))

const scraperObject = {
  // the url splitted in two parts
  url1: "https://www.geonames.org/advanced-search.html?q=&country=",
  url2: "&featureClass=P&startRow=",
  async scraper(browser, toSave, CountryData) {
    let page = await browser.newPage();
    let CountryCityList = [];
    let FoundEnd = false;
    
    // iterating through the pages the country has
    for(let CountryIndex = 0; CountryIndex<=5000 && !FoundEnd; CountryIndex+=50){
      console.log(`Navigating to ${this.url1}${CountryData["CountryCode"]}${this.url2}${CountryIndex}`);

      await page.goto(`${this.url1}${CountryData["CountryCode"]}${this.url2}${CountryIndex}`, {waitUntil: "domcontentloaded"});
      // Wait for the required DOM to be rendered
  
      for(let city = 3; city < 53; city++){
        // Check to see if there are any cities left
        try{
          await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+(city+1).toString()+']', {timeout: 1000})
        }catch{
          // if no cities left, stop searching
          console.log("End of Cities:", CountryIndex+city-3);
          FoundEnd = true;
          break
        }
        
        // checks if the city has data for population
        let hasPopulation = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[4]');
        let popText = await page.evaluate((hasPopulation) => {return hasPopulation.textContent}, hasPopulation);
        var hasPop = popText.includes("population");

        // checks if the city referes to a singular country
        let CountryLess = false;
        try{
          await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]/a', {timeout: 1000});
        } catch {
          console.log("City has no country:", CountryIndex+city-2);
          CountryLess = true;
        }
        
        let name = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[2]/a');
        let country = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]'+(CountryLess?'':'/a'));
        // checks if the city is assigned to a province
        try{
          var province = await page.waitForXPath('//*[@id="search"]/table/tbody/tr['+city.toString()+']/td[3]/text()', {timeout: 1000})
        } catch { 
          // if not, set province to country name
          console.log("Province set to country:", CountryIndex+city-2);
          province = country
        }
        // collect the rest of city data
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

        // remove ", " from the end of province
        if(cityData["province"]!=cityData["country"]) cityData["province"] = cityData["province"].substring(2);
        // if privince has a empty province set to country
        // diffrence from row 49 string then = "" now = ", "
        if(cityData["province"].length == 0) {
          cityData["province"] = cityData["country"]
          console.log("Province at",CountryIndex+city-2,"has length = 0 now set to", cityData["country"])
        }

        // the city is now assigned a population
        // if not, set population to -1 to be recognizable
        if(hasPop){
          cityData["population"] = cityData["population"].substring(11);
          let splitIndex = cityData["population"].indexOf(' ');
          if(splitIndex != -1){
            cityData["population"] = cityData["population"].substring(0, splitIndex-1);
          }
          cityData["population"] = cityData["population"].replace(/,/g, "");
          cityData["population"] = parseInt(cityData["population"]);
        }else cityData["population"] = -1; 

        // handele if the country is set to multiple countries. ex AX,FI 
        if(CountryLess && cityData["country"].substring(0, 2).toUpperCase() == CountryData["CountryCode"]) cityData["country"] = CountryData["CountryName"];
        if(cityData["country"] != CountryData["CountryName"]){
          console.log("Wrong country name at",CountryIndex+city-2+"!\nShould be \"" + CountryData["CountryName"]+ "\" but is \"" + cityData["country"] + "\"")
          continue;
        }

        //console.log(cityData) 
        CountryCityList.push(cityData);
      }
      
      // sleep random time between 0.25 and 0.05
      let randomTime = Math.random() * 0.25 + 0.05;
      console.log("Sleep for", randomTime, "seconds at end of page", CountryIndex/50+1)
      await sleep(randomTime)
    }

    // save file
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

    await browser.close();
  },
};

module.exports = scraperObject;
