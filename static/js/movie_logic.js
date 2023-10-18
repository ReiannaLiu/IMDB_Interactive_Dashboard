// --------------- UTILITY FUNCTIONS ---------------

// Clears the histogram container
function clearHistogram() {
    d3.select("#ratings").html("");
}

// Append rows to the soundtracks table 
function appendRowsToTable(data) {
    // Select the table body 
    let tbody = d3.select("#soundtracks").select("tbody");

    // Clear the table body
    tbody.html("");

    // Append rows to the table
    // Check if soundtracks exists and is not empty
    if (data.soundtracks && data.soundtracks.length > 0) {
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

// Updates the map with new data 
// Update the restyled plot's values
function updateMap(newdata) {
    // Clear the markers group 
    markers.clearLayers();

    // Create markers for each location in the dataset
    if (newdata.locations && newdata.locations.length > 0) {
        newdata.locations.forEach(location => {
            let marker = L.marker([location.lat, location.lon]).bindPopup(`<p>${location.location_name}</p>`);
            markers.addLayer(marker);
        });
    }
}

// Draws the histogram
function drawHistogram(histData) {
    clearHistogram();

    // Prepare the SVG area
    let svgWidth = 500, svgHeight = 400;
    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    let svg = d3.select("#ratings").html("").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract histogram data
    let histogram = [];
    Object.keys(histData.histogram).forEach(key => {
        histogram.push({ rating: +key, count: histData.histogram[key] });
    });

    // Scale the data
    let barWidth = width / 10;
    let x = d3.scaleLinear()
        .domain([0, 11])
        .range([0, width]);
    let y = d3.scaleLinear()
        .domain([0, d3.max(histogram, d => d.count)])
        .range([height, 0]);

    // Draw the bars
    svg.selectAll("rect")
        .data(histogram)
        .enter().append("rect")
        .attr("x", d => x(d.rating) - barWidth / 2)
        .attr("y", d => y(d.count))
        .attr("width", barWidth - 1)  // 10 bars for 10 ratings
        .attr("height", d => height - y(d.count))
        .attr("fill", "steelblue");

    // Add the axes
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));
}


function updateSoundtracks(newdata) {
    appendRowsToTable(newdata);
}

// --------------- INIT FUNCTIONS ---------------
// Initailizes the map
function initMap(movie) {
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

    if (movie.locations && movie.locations.length > 0) {
        // Create markers for each location in the dataset
        movie.locations.forEach(location => {
            let marker = L.marker([location.lat, location.lon]).bindPopup(`<p>${location.location_name}</p>`);
            markers.addLayer(marker);
        });

        // Add our marker cluster layer to the map
        markers.addTo(map);
    }
}

// Initializes the soundtracks table
function initSoundtracks(movie) {
    appendRowsToTable(movie);
}

// --------------- EVENT HANDLERS ---------------
// Handles the event when a new movie is selected
function optionChanged() {
    let dropdownMenu = d3.select("#selMovies");
    // Assign the value of the dropdown menu option to a variable
    let movie = dropdownMenu.property("value");

    let movieData = moviejson.filter(m => m.title === movie)[0];

    let histSelect = d3.select("#selHist");

    // Append options to the select element
    histSelect.html("");
    if (movieData.ratingsHistograms && Object.keys(movieData.ratingsHistograms).length > 0) {
        Object.keys(movieData.ratingsHistograms).forEach(key => {
            histSelect.append("option").text(key).property("value", key);
        });
        let defaultHist = Object.keys(movieData.ratingsHistograms)[0];
        ratingChanged(defaultHist);
    } else {
        histSelect.append("option").text("No histograms available").property("value", "");
    }

    // Call function to update the chart
    updateMap(movieData);
    updateSoundtracks(movieData);
}

// Handles the event when a new histogram is selected
function ratingChanged(histName) {
    let selectedMovie = d3.select("#selMovies").property("value");
    let movieData = moviejson.filter(m => m.title === selectedMovie)[0];
    let histData = movieData.ratingsHistograms[histName];
    drawHistogram(histData);
}

// --------------- DATA LOADING ---------------

var movieData = "http://127.0.0.1:5000/api/read_all";
var moviejson;
const movieSelect = d3.select("#selMovies");
const histSelect = d3.select("#selHist");
let markers = L.layerGroup();

// Get the data with d3.
d3.json(movieData).then(function (data) {
    moviejson = data;

    // Populate movies dropdown
    moviejson.forEach(movie => {
        movieSelect.append("option").text(movie.title).property("value", movie.title);
    });

    // Set the default movie and initialize the visuals 
    movieSelect.property("value", selectedMovieTitle);
    let movie = moviejson.filter(m => m.title === selectedMovieTitle)[0];
    initMap(movie);
    initSoundtracks(movie);

    // Initialize teh histograms dropdown for the default movie
    if (movie.ratingsHistograms && Object.keys(movie.ratingsHistograms).length > 0) {
        Object.keys(movie.ratingsHistograms).forEach(key => {
            histSelect.append("option").text(key).property("value", key);
        });
        let defaultHist = Object.keys(movie.ratingsHistograms)[0];
        ratingChanged(defaultHist);
    }
    else {
        histSelect.append("option").text("No histograms available").property("value", "");
    }
});



// Register the event handler
d3.selectAll("#selMovies").on("change", optionChanged);