const browserObject = require("./browser");
const codeController = require("./CodeController");
const cityController = require("./CityController");
const fs = require('fs');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
let countries;
try{
    countries = require('../CountryCodes.json');
}catch{
    codeController(browserInstance);
    countries = require('../CountryCodes.json');
}

console.log(countries[fs.readdirSync('./Countries/').length])
cityController(browserInstance, countries[fs.readdirSync('./Countries/').length]);