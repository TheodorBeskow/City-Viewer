import matplotlib.pyplot  as plt
import json
  
# take in the desired country code
cc = input("Country code: ").upper()
f = open('./Countries/'+cc+'.json', 'r', encoding='utf8')

  
# returns JSON object as a dictionary
cities = json.load(f)
print(f"Amount of cities in country {cc} = {len(cities)}")

XList = []
YList = []

# Adding all the coordinates of the cities to XList and YList
for city in cities:
    XList.append(city["longitude"])
    YList.append(city["latitude"])
  
# Closing json file
f.close()

# Showing UI
plt.close("all")
plt.scatter(XList, YList, s=1)
plt.axis('scaled')
plt.show()