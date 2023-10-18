// Load the json data
var movieData = "http://127.0.0.1:5000/read_all";

var moviejson;

const select = d3.select("#selMovies");

// Get the data with d3.
d3.json(movieData).then(function (data) {
    moviejson = data;

    // Append options to the select element
    for (let i = 0; i < moviejson.length; i++) {
        let movie = moviejson[i]
        select.append("option").text(movie.title).property("value", movie.title);
    }
});

// On change to the dropdown
d3.selectAll("#selMovies").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
    let dropdownMenu = d3.select("#selMovies");
    // Assign the value of the dropdown menu option to a variable
    let movie = dropdownMenu.property("value");
}