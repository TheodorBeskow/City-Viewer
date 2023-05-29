import matplotlib.pyplot  as plt
import glob
import json
  
# take in the desired country code
cc = input("Country code: ").upper()
  
XList = []
YList = []
SizeList = []
BiggestCity = 1

# Function to add all cities from a country
def addCoordinates(countryCode):
    global BiggestCity

    # Find json file
    try:
        f = open('Scraper/Countries/'+countryCode+'.json', 'r', encoding='utf8')
    except:
        print("There are no country with country code name", countryCode)
        quit()

    # MÅSTE TESTA DETTA!!!!!!!!!!!!!!!
    # Returns JSON object as a dictionary
    try:
        cities = json.load(f)
    except:
        print("Json file with name", countryCode + ".json failed")
        quit()

    # Adding all the coordinates of the cities to XList and YList
    for city in cities:
        BiggestCity = max(BiggestCity, city["population"])
        if city["population"] < 500000: continue
        SizeList.append(city["population"]+100)
        XList.append(city["longitude"])
        YList.append(city["latitude"])
    
    # Closing json file
    f.close()

if cc == "ALL":
    for file in glob.glob("Scraper/Countries/*"):
        addCoordinates(file[-7:-5])
elif len(cc) == 3:
    f2 = open('Scraper/CountryCodes.json', 'r', encoding='utf8')
    countries = json.load(f2)
    for i, file in enumerate(glob.glob("Scraper/Countries/*")):
        if cc[1:] != countries[i]["CountryContinent"]: continue
        addCoordinates(file[-7:-5])
else: addCoordinates(cc)

if cc[1:] == "OC": XList = [xpos if xpos>0 else xpos+360 for xpos in XList]
SizeList = [siz * 25 / BiggestCity for siz in SizeList]

print(len(XList))
# Showing UI
plt.close("all")
plt.scatter(XList, YList, s=SizeList)
plt.axis('scaled')
plt.show()