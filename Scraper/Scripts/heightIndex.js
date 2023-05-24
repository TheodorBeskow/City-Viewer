const browserObject = require("./browser");
const heightController = require("./heightController");
const fs = require('fs');

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

heightController(browserInstance);