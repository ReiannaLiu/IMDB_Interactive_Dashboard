
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
    initSoundtracks();
});

function appendRowsToTable(data) {
    // Select the table body 
    let tbody = d3.select("#soundtracks").select("tbody");
    console.log(data.soundtracks)

    // Clear the table body
    tbody.html("");

    // Append rows to the table
    // Check if soundtracks exists and is not empty
    if (data.soundtracks && data.soundtracks.length > 0) {
        console.log(data.soundtracks);

        // Append rows to the table
        data.soundtracks.forEach(sound => {
            let row = tbody.append("tr");
            row.append("td").text(sound.soundtracks_name);
            row.append("td").text(2);
        });
    } else {
        let row = tbody.append("tr");
        row.append("td").attr("colspan", 2).text("No soundtracks available");
    }
}

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

function initSoundtracks() {
    appendRowsToTable(moviejson[0]);
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
    updateSoundtracks(movieData);
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

function updateSoundtracks(newdata) {
    appendRowsToTable(newdata);
}