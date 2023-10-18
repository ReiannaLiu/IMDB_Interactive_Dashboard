
// Load the json data
var movieData = "http://127.0.0.1:5000/read_all";

var moviejson;

const select = d3.select("#selMovies");

// Create a marker layer group.
let markers = L.layerGroup();

// Get the data with d3.
d3.json(movieData).then(function (data) {
    moviejson = data;

    // Append options to the select element
    for (let i = 0; i < moviejson.length; i++) {
        let movie = moviejson[i]
        select.append("option").text(movie.title).property("value", movie.title);
    }

    initMap();
});

// Display the default plot
function initMap() {
    let movie = moviejson[0];
    let map = L.map("map", {
        center: [0, 0],
        zoom: 2
    });

    // Create the tile layer that will be the background of our map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Clear the markers
    markers.clearLayers();


    // Create markers for each location in the dataset
    movie.locations.forEach(location => {
        let marker = L.marker([location.lat, location.lon]).bindPopup(`<p>${location.location_name}</p>`);
        markers.addLayer(marker);
    });

    // Add our marker cluster layer to the map
    markers.addTo(map);
}

// On change to the dropdown
d3.selectAll("#selMovies").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
    let dropdownMenu = d3.select("#selMovies");
    // Assign the value of the dropdown menu option to a variable
    let movie = dropdownMenu.property("value");

    let movieData = moviejson.filter(m => m.title === movie)[0];

    // Call function to update teh chart
    updateMap(movieData);
}

// Update the restyled plot's values
function updateMap(newdata) {
    // Clear the markers group 
    markers.clearLayers();

    // Create markers for each location in the dataset
    newdata.locations.forEach(location => {
        let marker = L.marker([location.lat, location.lon]).bindPopup(`<p>${location.location_name}</p>`);
        markers.addLayer(marker);
    });
}