# SolarPannel

-	Map.js: 
•	Appliances array: List of devices used in household. You could change quantity, usage hours and power of devices. 
•	Household array: List of 4 houses having unique ID, name, power consumption and devices list for the house. 
•	Create map: call back function to create a map, generate the 4 markers. 

•	Remove markers: Set onclick the marker on the map, then household will be removed immediately from the map and devices list of the markers. Then, the total power generation on graph and pie chart will be reduced. 
•	getSensorData2(): based on location of the marker on the map, this function will collect the data from Node Red and OpenWeatherMap service to display weather condition, temperature, cloud cover and pass the power generated and power consumption to local storage to display on pie chart and graph 

-	Weather.js: 
getWeather(): collect data from 4 cities displaying on web application. It will show the weather current, lowest temperature, hottest temperature of the days.  

-	Charbar.js: 
ChartButton(): Summarise weather data and power consumption of houses on the map. The total power generated is also displayed as a graph for comparison between 4 types of houses. 


