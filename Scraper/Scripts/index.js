const browserObject = require("./browser");
const codeController = require("./CodeController");
const readline = require("readline");
const cityController = require("./CityController");
const fs = require('fs');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

var countries;

async function main() {
    // see if country codes are saved
    try{
        countries = require('../CountryCodes.json');
    }catch{
        // if not we start to scrape the country codes
        console.log("Need to scape Countries")
        await codeController(browserInstance);
        countries = require('../CountryCodes.json');
    }
    // Pass the browser instance to the scraper controller
    console.log(countries)

    // set input to stdin (standard input)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // take input of country code
    rl.question("Country to scan or leave empty to scrape next country: ", function (cc) {
        cc = cc.toUpperCase();
        var countryToScrape = null;

        // Open country codes json file
        fs.readFile('Scraper/CountryCodes.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                return;
            }
            const countryCodes = JSON.parse(data);
            
            // look if the inputed country code exists
            for(let i in countryCodes){
                let country = countryCodes[i];
                // console.log(country);
                if(cc == country["CountryCode"]) {
                    console.log("Found country with country code", cc+"!");
                    countryToScrape = country;
                }
            }
            try{
                // if no country code specified get next country to scrape
                if(countryToScrape == null)  countryToScrape = countries[fs.readdirSync('./Countries/').length];
                // scrape coutry
                cityController(browserInstance, countryToScrape);
            }catch{
                console.log("You have already scraped all countries and", cc, "is not a valid country code.");
            }
        });
        rl.close();
    });
}

main();

