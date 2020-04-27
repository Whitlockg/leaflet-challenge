var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


d3.json(url, function(data) {

  dataFeatures(data.features);
  console.log(data.features)
});

//personalizing features based on data provided
function dataFeatures(earthquakeData) {

//loop through 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

//define size of each marker
  function markerSize(magnitude) {
    return magnitude * 10500;
  }

//define color of each marker
  function markerColor(magnitude) {
    if (magnitude < 1) {
      return "#DAF7A6"
    }
    else if (magnitude < 2) {
      return "#ffff33"
    }
    else if (magnitude < 3) {
      return "#FFC300"
    }
    else if (magnitude < 4) {
      return "#FF5733"
    }
    else if (magnitude < 5) {
      return "#C70039"
    }
    else {
      return "#900C3F"
    }
  }

//variable to create markers with earthquake data and put onto map
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: markerSize(earthquakeData.properties.mag),
        color: markerColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  buildMap(earthquakes);
}

//function to build the map
function buildMap(earthquakes) {


  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  // define base layers
  var baseMaps = {
    "Outdoors Map": outdoorsMap,
    "Greyscale Map": grayscaleMap,
    "Satellite Map": satelliteMap
  };

  // create object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // 
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [outdoorsMap, earthquakes]
  });

  // creates buttons in top right to switch maps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // color function to create legend
  function getColor(d) {
    return d > 5 ? '#900C3F' :
           d > 4  ? '#C70039' :
           d > 3  ? '#FF5733' :
           d > 2  ? '#FFC300' :
           d > 1  ? '#FFFF33' :
                    '#DAF7A6';
  }

// function to add legend to map
  var legend = L.control({position: 'bottomleft'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];

          
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}