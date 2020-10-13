var City = ["Melbourne, Au", "Geelong, Au", "Sydney, NSM", "Brisbane, Au"];
var Data = [];
var getWeather = function (city) {
  $.getJSON(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=9a06430e50edbedd9e1b7e33089dca45&units=metric",
    function (data, status) {
      var weather_description = data.weather[0].description;
      var cloud_cover = data.clouds.all;
      var temperature = data.main.temp;
      var temperature_feel = data.main.feels_like;
      var max_tempature = data.main.temp_max;
      var min_tempature = data.main.temp_min;
      Data.push({
        weather_description: weather_description,
        cloud_cover: cloud_cover,
        temperature: temperature,
        temperature_feel: temperature_feel,
        max_tempature: max_tempature,
        min_tempature: min_tempature,
      });

      $("#weather_simulator #" + Data.length).append(
        "<b>Forecast:</b> " +
          weather_description +
          " (" +
          cloud_cover +
          "%)" +
          " <br><b>Today</b>: <span class='min_temperature'><b>L</b></span>: " +
          min_tempature +
          "°C, <span class='max_temperature'><b>H</b></span>: " +
          max_tempature +
          "°C <br> <b>Current</b>: " +
          temperature +
          "°C<br>"
      );
    }
  );
};

for (var i = 0; i < City.length; i++) {
  getWeather(City[i]);
}
