# City-Viewer

## Drawbacks
Magsha bahrain and AS: American Samoa and Saudi Arabia
country https://www.geonames.org/advanced-search.html?q=&country=AU&featureClass=P&startRow=0
county https://www.geonames.org/advanced-search.html?q=&country=BS&featureClass=P&startRow=300




# Unity part

https://visibleearth.nasa.gov/images/73934/topography

https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md


Yes, the step-by-step guide I provided for setting up your own instance of Open-Elevation using Docker should work for Windows 10. Here is the guide again, with some additional information for Windows users:

1. Install Docker Desktop for Windows by following the instructions on the [Docker website](https://docs.docker.com/docker-for-windows/install/).
2. Open a command prompt and pull the Open-Elevation Docker image by running the command `docker pull jorl17/open-elevation`.
3. Run a container with the Open-Elevation image by running the command `docker run -p 8080:8080 -it jorl17/open-elevation`. This will start the Open-Elevation service and make it accessible at `http://localhost:8080`.
4. Download the elevation data that you want to use with the service. You can find instructions on how to do this in the **What about the data?** section of the [Open-Elevation documentation](https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md).
5. Set up the elevation data by following the instructions in the **What about the data?** section of the [Open-Elevation documentation](https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md).

Once you have completed these steps, you should have your own instance of Open-Elevation up and running on your Windows 10 machine. You can then use it to retrieve elevation data for locations on the surface of the earth by sending requests to `http://localhost:8080`.

Is there anything else you would like to know?


