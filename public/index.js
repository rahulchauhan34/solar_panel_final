var getSensorData = function (location) {
  if (!location) {
    $("#id01").empty();
    return $("#id01").append("<h2>Please provide your address</h2>");
  }
  $.getJSON("https://solarpanel.mybluemix.net/test?city=" + location, function (
    data,
    status
  ) {
    console.log(JSON.stringify(data));
    $("#tdata").empty();
    $("#id01").empty();
    $("#address").empty();
    $("#weather").empty();
    $("#cloudcover").empty();
    $("#temperature").empty();
    $("#address").append(data.address);
    $("#weather").append(data.weather_description);
    $("#cloudcover").append(data.cloudcover);
    $("#temperature").append(data.temperature);
    $("#timezone").empty();
    $("#timezone").append(data.time);
    $("#PowerGenerated").empty();
    let STC = 250;
    let power_output;
    let temp = data.temperature;
    let day = data.is_day;
    if (day == "yes") {
      if (temp < 0) {
        power_output = 0;
      }
      if (temp < 10) {
        if ((data.cloudcover = 0)) {
          power_output = 250 * 0.3;
        } else if (data.cloudcover < 20) {
          power_output = 250 * 0.2;
        } else if (data.cloudcover >= 20 && data.cloudcover < 70) {
          power_output = 250 * 0.15;
        } else if (data.cloudcover >= 70) {
          power_output = 250 * 0.1;
        }
      }
      if (temp >= 10 && temp < 16) {
        if (data.cloudcover < 20) {
          power_output = 250 * 0.6;
        } else if (data.cloudcover >= 20 && data.cloudcover < 70) {
          power_output = 250 * 0.4;
        } else if (data.cloudcover >= 70) {
          power_output = 250 * 0.2;
        }
      }
      if (temp >= 16 && temp < 25) {
        if (data.cloudcover < 20) {
          power_output = 250 * 0.9;
        } else if (data.cloudcover >= 20 && data.cloudcover < 70) {
          power_output = 250 * 0.4;
        } else if (data.cloudcover >= 70) {
          power_output = 250 * 0.2;
        }
      }
      if (temp >= 25) {
        if (data.cloudcover == 0) {
          power_output = 250 - (30 + temp - 25) * 0.005 * 250;
        }
        if (data.cloudcover < 20) {
          power_output = 250 - (30 + temp - 25) * 0.005 * 250 * 0.75;
        }
        if (data.cloudcover >= 20 && data.cloudcover < 70) {
          power_output = 250 - (30 + temp - 25) * 0.005 * 250 * 0.5;
        }
        if (data.cloudcover >= 70) {
          power_output = 250 - (30 + temp - 25) * 0.005 * 250 * 0.25;
        }
      }
    } else {
      $("#PowerGenerated").append(0);
    }
    $("#PowerGenerated").append(power_output);
    $("#id01").append(
      "<h5>The estimated Solar power generation for today will be</h5>",
      " <h4><strong>" + power_output + " KWh</strong></h4>"
    );
    $(document).ready(function () {
      console.log(["my dom is ready"]);
    });
  });
};
