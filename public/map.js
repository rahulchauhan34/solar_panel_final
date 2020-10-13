var iconWidth = 10;
var iconHeight = 10;
var langitude, longitude;
var already_on_map = false;
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var power_of_house = [];
var Total_power = [0, 0, 0, 0];
var total_houses = [0, 0, 0, 0];
var power_consumption = [8000, 13000, 21000, 30000];
var house_selected;
var selection_list = [];
var housetype;

var appliance_selected;
var appliances = [
  { id: "1", name: "Television", energy: 70, hours: 3, quatity: 1 },
  { id: "2", name: "Computer", energy: 300, hours: 4, quatity: 1 },
  { id: "3", name: "Microwave", energy: 800, hours: 1, quatity: 1 },
  { id: "4", name: "Dishwasher", energy: 520, hours: 1, quatity: 1 },
  { id: "5", name: "Kettle", energy: 900, hours: 1, quatity: 1 },
  { id: "6", name: "Hairdryer", energy: 500, hours: 1, quatity: 1 },
  { id: "7", name: "iron", energy: 1000, hours: 1, quatity: 1 },
  { id: "8", name: "Refrigerator", energy: 195, hours: 1, quatity: 1 },
  { id: "9", name: "other", energy: 70, hours: 1, quatity: 1 },
];
var Houses = [
  {
    id: "1",
    name: "House1",
    icon: "house1.png",
    power_consumption: power_consumption[0],
    house_map: "house_mini1.png",
    devices: [],
  },
  {
    id: "2",
    name: "House2",
    icon: "house2.png",
    power_consumption: power_consumption[1],
    house_map: "house_mini2.png",
    devices: [],
  },
  {
    id: "3",
    name: "House3",
    icon: "house3.png",
    power_consumption: power_consumption[2],
    house_map: "house_mini3.png",
    devices: [],
  },
  {
    id: "4",
    name: "House4",
    icon: "house4.png",
    power_consumption: power_consumption[3],
    house_map: "house_mini4.png",
    devices: [],
  },
];
var map;
var overlay;
function createMap() {
  var map;
  var markers = [];
  // var latitude, longitude;

  var option = {
    center: { lat: -37.8044416, lng: 144.97218568 },
    zoom: 14,
  };

  //google map
  map = new google.maps.Map(document.getElementById("map"), option);
  generatePageMarkers(Houses);
  sellect_appliances(appliances);

  map.addListener("click", function (event) {
    addMarker(event.latLng);
  });

  // Adds a marker to the map and push to the array.
  function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      id: house_selected.id,
      icon: house_selected.house_map,
      name: house_selected.name,
      draggable: true,
      number: markers.length,
    });
    markers.push(marker);
    marker.addListener("click", function (event) {
      removeMarker(event.latLng);
    });

    localStorage.setItem("id", house_selected.id);
    getSensorData2(location.lat(), location.lng(), marker.number);
  }

  //remove markers
  function removeMarker(location) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].position == location) {
        markers[i].setMap(null);
        Total_power[markers[i].id - 1] =
          Total_power[markers[i].id - 1] - power_of_house[i].power_output;

        total_houses[markers[i].id - 1] = total_houses[markers[i].id - 1] - 1;
        localStorage.setItem("houses", total_houses);
        console.log(Total_power);
        localStorage.setItem("chart", Total_power);
        $("#house" + markers[i].id + "  #" + markers[i].number).remove();
        removeItemOnce(markers, markers[i]);
        removeItemOnce(power_of_house, power_of_house[i]);
      }
    }
  }

  //remove from array
  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }
  //close and save button of the blocks
  $("#energy_consumption").click(function () {
    var consumption = 0;
    //getting data from the table2
    for (var i = 0; i < Houses[housetype].devices.length; i++) {
      var name1 = $("#name" + i).text();
      var hours = $("#hours" + i).val();
      var energy1 = $("#energiess" + i).val();
      var quatity1 = $("#quatitiess" + i).val();
      consumption += hours * energy1 * quatity1;
      console.log(name1);
    }

    console.log(consumption);
    power_consumption[housetype] = consumption;
    $("#house_type" + Houses[housetype].id).empty();
    $("#house_type" + Houses[housetype].id).append(consumption);
    modal.style.display = "none";
  });
}

// function sumary(arr) {
//   var sum = 0;
//   for (var i in arr) {
//     if (arr[i].id) {
//       var energy = arr[i].energy;
//       var hours = arr[i].hours;
//       var quatity = arr[i].quatity;
//       var total_consumption = energy * hours * quatity;
//       sum += total_consumption;
//     }
//   }
//   return sum;
// }

// List houses
function generatePageMarkers(data) {
  for (var i in data) {
    if (data[i].id) {
      var content =
        '<li><img data-id="' +
        data[i].id +
        '" class="dragicon" data-toggle="popover"  title="Dismissible popover" data-content="And heres some amazing content. Its very engaging. Right?" src="' +
        data[i].icon +
        '"/><br/><span class="name"><p class="power_household" id="house_type' +
        data[i].id +
        '">' +
        data[i].power_consumption +
        "</p><p class='wh'>Wh/day</p><button class='appliance' data-id=" +
        data[i].id +
        ">Select Appliance</button>";
      $("#dropzone").append(content);
    }
  }

  // onclick select appliances
  $(".appliance").click(function () {
    housetype = Houses.itemIndex("id", $(this).data("id"));
    selection_lists(Houses[housetype].devices);
    modal.style.display = "block";
  });

  //select icon
  $(".dragicon").click(function () {
    var index = Houses.itemIndex("id", $(this).data("id"));
    console.log(index);
    house_selected = Houses[index];
  });
}

// list of appliances to sellect
function sellect_appliances(data) {
  for (var i in data) {
    if (data[i].id) {
      var content =
        '<div class="column1" ><p class="selection" data-id=' +
        data[i].id +
        ">" +
        data[i].name +
        "<br>" +
        data[i].energy +
        "KW</p></div>";
    }
    $("#appliances_selected").append(content);
  }

  // onclick select the the left hand will display it
  $(".selection").click(function () {
    var index = appliances.itemIndex("id", $(this).data("id"));

    appliance_selected = appliances[index];

    selection_list.push(appliance_selected);
    Houses[housetype].devices.push(appliance_selected);

    var id = Houses[housetype].devices.length - 1;
    console.log(id);
    $("#list_selection").append(
      "<tr><td id='name" +
        id +
        "'>" +
        appliance_selected.name +
        "</td><td><div class='hours'><input id='hours" +
        id +
        "' value='" +
        appliance_selected.hours +
        "' /><div></td><td><div class='hours'><input id='energiess" +
        id +
        "' value='" +
        appliance_selected.energy +
        "' /><div></td><td><div class='hours'><input id='quatitiess" +
        id +
        "' value='" +
        appliance_selected.quatity +
        "'/></div></td></tr>"
    );
  });
}

//display selected appliances for each house
function selection_lists(data) {
  $("#list_selection").empty();
  for (var i in data) {
    if (data[i].id) {
      $("#list_selection").append(
        "<tr><td>" +
          data[i].name +
          "</td><td><div class='hours'><input id='hours" +
          i +
          "' value='" +
          data[i].hours +
          "' /><div></td><td><div class='hours'><input id='energiess" +
          i +
          "' value='" +
          data[i].energy +
          "' /><div></td><td><div class='hours'><input id='quatitiess" +
          i +
          "' value='" +
          data[i].quatity +
          "'/></div></td></tr>"
      );
    }
  }
}

Array.prototype.itemIndex = function (key, item) {
  for (i = 0; i < this.length; i++) {
    if (this[i][key] == item) {
      return i;
    }
  }
  return -1;
};

//get data
var getSensorData2 = function (latitude, longitude, number) {
  $.getJSON(
    "https://solarpanel.mybluemix.net/test?latitude=" +
      latitude +
      "&longitude=" +
      longitude,
    function (data, status) {
      // console.log(JSON.stringify(data));
      let STC = 250;
      let power_output;
      let temp = data.temperature;
      let current_time = data.time;
      var time = new Date(current_time * 1000);
      let sunrise = data.sunrise;
      let sunset = data.sunset;
      var sunrise_time = new Date(sunrise * 1000);
      var sunset_time = new Date(sunset * 1000);

      var duration = sunset_time.getHours() - sunrise_time.getHours();

      // if ((current_time > sunrise) & (current_time < sunset)) {
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
          power_output = 250 * 0.7;
        } else if (data.cloudcover >= 20 && data.cloudcover < 70) {
          power_output = 250 * 0.5;
        } else if (data.cloudcover >= 70) {
          power_output = 250 * 0.25;
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
      // } else {
      //   power_output = 0;
      // }

      power_of_house.push({
        number: number,
        power_output: power_output,
        latitude: latitude,
        longitude: longitude,
      });

      if ((already_on_map = true)) {
        $("#tdata").empty();
        $("#id01").empty();
        $("#address").empty();
        $("#weather").empty();
        $("#cloudcover").empty();
        $("#temperature").empty();
        $("#PowerGenerated").empty();
        $("#timezone").empty();
      }

      if (localStorage.getItem("id") === "1") {
        var Total_power1 = duration * power_output;
        var number_panel = Math.ceil(power_consumption[0] / Total_power1);
        Total_power[0] += power_output;
        total_houses[0] += 1;
        $("#house1").append(
          "<tr id=" +
            number +
            "><td>" +
            data.address +
            "</td><td>" +
            data.weather_description +
            "</td><td>" +
            data.temperature +
            "</td><td >" +
            power_output +
            "</td><td>" +
            number_panel +
            "</td></tr>"
        );
      }

      if (localStorage.getItem("id") === "2") {
        var Total_power1 = duration * power_output;
        var number_panel = Math.ceil(power_consumption[2] / Total_power1);
        Total_power[1] += power_output;
        total_houses[1] += 1;
        $("#house2").append(
          "<tr id=" +
            number +
            "><td>" +
            data.address +
            "</td><td>" +
            data.weather_description +
            "</td><td>" +
            data.temperature +
            "</td><td >" +
            power_output +
            "</td><td>" +
            number_panel +
            "</td></tr>"
        );
      }
      if (localStorage.getItem("id") === "3") {
        var Total_power1 = duration * power_output;
        var number_panel = Math.ceil(power_consumption[0] / Total_power1);
        Total_power[2] += power_output;
        total_houses[2] += 1;
        $("#house3").append(
          "<tr id=" +
            number +
            "><td>" +
            data.address +
            "</td><td>" +
            data.weather_description +
            "</td><td>" +
            data.temperature +
            "</td><td >" +
            power_output +
            "</td><td>" +
            number_panel +
            "</td></tr>"
        );
      }
      if (localStorage.getItem("id") === "4") {
        var Total_power1 = duration * power_output;
        var number_panel = Math.ceil(power_consumption[0] / Total_power1);
        Total_power[3] += power_output;
        total_houses[3] += 1;
        $("#house4").append(
          "<tr id=" +
            number +
            "><td>" +
            data.address +
            "</td><td>" +
            data.weather_description +
            "</td><td>" +
            data.temperature +
            "</td><td >" +
            power_output +
            "</td><td>" +
            number_panel +
            "</td></tr>"
        );
      }

      localStorage.setItem("chart", Total_power);
      localStorage.setItem("houses", total_houses);
      localStorage.setItem("consumption", power_consumption);
    }
  );
};
