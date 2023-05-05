import matplotlib.pyplot  as plt
import glob
import json
  
# take in the desired country code
cc = input("Country code: ").upper()
  
XList = []
YList = []

# Function to add all cities from a country
def addCoordinates(countryCode):
    # Find json file
    try:
        f = open('./Countries/'+countryCode+'.json', 'r', encoding='utf8')
    except:
        print("There are no country with country code name", countryCode)
        quit()

    # Returns JSON object as a dictionary
    cities = json.load(f)

    # Adding all the coordinates of the cities to XList and YList
    for city in cities:
        XList.append(city["longitude"])
        YList.append(city["latitude"])
    
    # Closing json file
    f.close()

if cc == "ALL":
    for file in glob.glob("./Countries/*"):
        addCoordinates(file[-7:-5])
else: addCoordinates(cc)

# Showing UI
plt.close("all")
plt.scatter(XList, YList, s=1)
plt.axis('scaled')
plt.show()