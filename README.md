# City-Viewer


# License

See license in the LICENSE file.


# Installation



## Cloning the project

Open your terminal and navigate to the directory where you want to clone the project.

Run the following command to clone the project: 
```sh
git clone https://github.com/TheodorBeskow/City-Viewer
```

Then navigate into the project directory with this:
```sh
cd ./City-Viewer
```


## Installing needed configuration files

Make sure you have Node.js installed on your computer. If not, you can download it [here](https://nodejs.org/en/download/).

Now run the following command to install all the needed dependencies:
```sh
cd ./Scraper
npm install
cd ..
```


# Manual

To scrape all the cities from a country enter the following command in the root of the project:
```sh
node ./Scraper/Scripts/index.js
```
If needed the Countries will be scraped scraped.

You will now be prompted to enter a country code or leave the input empty. If you do not know a certain country's coutry code you can look for it in the newly created CountryCodes.json file. Once you are happy with you decition press enter. You can now wait until the program is done scraping that coutry. During this this time you can easily monitor the program with the self explainatory frequent logs to the console.



# Visualize

## Plotting

To plot all cities enter this in the terminal of the project root:
```sh
python ./Scraper/Scripts/VisualizeData.js
```
You can then enter the coutry code of a coutry. Look in 'CountryCodes.json' to find all countries coutry code. Alternative you can enter **all** to plot all coutries, although this could lag alot if you keep the minimum population low. There is also support to enter continents, you can do this by entering any character and then two characters to represent the continent. Continent representation can also be found in 'CountryCodes.json'. The input is not case sensetive. 

You then need to enter the minimum population a city must have for it to be plotted. There are many cities that I do not have population for because the webbsite I scraped from did not have population for all cities. These cities population are set to -1, so to plot all cities enter -1. 

### Examples

```
Country code: fr
Show cities above a population of: -1
Plotting 5046 cities
```
![Plot of France](images/France.PNG)
```
Country code: _af
Show cities above a population of: -1
Plotting 200740 cities
```
![Plot of Africa](images/Africa.PNG)
```
Country code: all
Show cities above a population of: 100
Plotting 110245 cities
```
![Plot of the World](images/World.PNG)


## Water height Simulation

This project uses this height map to get the height of the world in diffrent locations.
![height map](images/HeightMapDemo.PNG)


<!-- https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md -->


The data should already be added to the unity project but if not, you will have to manually copy  the **Countries** folder in to the **Assets** folder in unity. 
To start the simulation you can just press play and use the scroller to change the water level.


## Problems
Magsha bahrain and AS: American Samoa and Saudi Arabia
country https://www.geonames.org/advanced-search.html?q=&country=AU&featureClass=P&startRow=0
county https://www.geonames.org/advanced-search.html?q=&country=BS&featureClass=P&startRow=300



## Credits

The height map is downloaded from [this](https://visibleearth.nasa.gov/images/73934/topography) site.

