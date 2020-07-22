var geojson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

var earthquakeLayer = new L.LayerGroup();

var mapLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoibGJ1dHRvbiIsImEiOiJja2N3Y3ZhamYwYTM0MnpxcGt3b256eXo5In0.vU5gLoHRULsIU-6WakyIyw"
});

var leafletMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
    layers: [mapLayer, earthquakeLayer]
});

L.control.layers(mapLayer, earthquakeLayer).addTo(myMap);

d3.json(earthquakesURL, function(earthquakeData) {
    function markerScale(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }

    function geojsonMarkerOptions(feature) {
        return {
          opacity: 1,
          fillOpacity: .8,
          fillColor: markerColor(feature.properties.mag),
          color: "#000000",
          radius: markerScale(feature.properties.mag),
          weight: 1
        };
    }

    function markerColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#581845";
        case magnitude > 4:
            return "#900C3F";
        case magnitude > 3:
            return "#C70039";
        case magnitude > 2:
            return "#FF5733";
        case magnitude > 1:
            return "#FFC300";
        default:
            return "#DAF7A6";
        }
    }

    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: geojsonMarkerOptions,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Location: " + feature.properties.place +
            "\nMagnitude: " + feature.properties.mag);
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(leafletMap);
});
