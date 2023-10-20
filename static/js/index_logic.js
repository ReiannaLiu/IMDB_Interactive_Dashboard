// --------------- Variables and Configurations ---------------
var movieData = "http://127.0.0.1:5000/api/read_all";
var allMovies; // This variable will hold the data

// --------------- Data Loading -------------------------------
d3.json(movieData).then(function (data) {
    allMovies = data;
    displayMovies(allMovies); // Initial display of all movies
});

// --------------- Rendering Functions ------------------------
function displayMovies(data) {
    let tbody = d3.select("#movies").select("tbody");

    for (let i = 0; i < data.length; i += 4) {
        let row = tbody.append("tr");

        for (let j = 0; j < 4 && (i + j) < data.length; j++) {
            let movie = data[i + j];
            let cell = row.append("td").attr("class", "text-center");

            // Container for the movie image
            let imgContainer = cell.append("div");
            imgContainer.append("img")
                .attr("src", movie.image_url)
                .attr("alt", movie.title)
                .attr("class", "mx-auto d-block")
                .style("height", "200px")
                .style("width", "auto")
                .style("margin-bottom", "10px");

            // Container for the movie title
            let titleContainer = cell.append("div");
            titleContainer.append("a")
                .attr("href", `/movie/${movie.title}`)
                .text(movie.title);

            // Container for the "More Info" button
            let buttonContainer = cell.append("div");
            buttonContainer.append("button")
                .attr("type", "button")
                .attr("class", "btn btn-outline-dark mt-2")
                .attr("data-bs-toggle", "modal")
                .attr("data-bs-target", `#modal-${movie.id}`)
                .text("More Info");

            // Create the modal structure for each movie
            let modal = cell.append("div")
                .attr("class", "modal fade")
                .attr("id", `modal-${movie.id}`)
                .attr("aria-hidden", "true");

            let modalDialog = modal.append("div").attr("class", "modal-dialog");
            let modalContent = modalDialog.append("div").attr("class", "modal-content");

            // Add the modal header
            let modalHeader = modalContent.append("div").attr("class", "modal-header");
            modalHeader.append("h5").attr("class", "modal-title").text(movie.title);
            modalHeader.append("button")
                .attr("type", "button")
                .attr("class", "btn-close")
                .attr("data-bs-dismiss", "modal")
                .attr("aria-label", "Close");

            // Add the modal body
            let modalBody = modalContent.append("div").attr("class", "modal-body");

            if (movie.releaseDate) {  // Check if releaseDate exists and is not null
                modalBody.append("p").html("Release Date: " + movie.releaseDate);
            }

            if (movie.genres && movie.genres.length > 0) {  // Check if genres array exists and has elements
                modalBody.append("p").html("Genre(s): " + movie.genres.join(', '));
            }

            if (movie.rating) {  // Check if rating exists and is not null
                modalBody.append("p").html("IMDB Rating: " + movie.rating);
            }

            if (movie.runningTimeInMinutes) {  // Check if runningTimeInMinutes exists and is not null
                modalBody.append("p").html("Running Time: " + movie.runningTimeInMinutes + " minutes");
            }

        }
    }
}


// --------------- Utility Functions --------------------------
function clearMovies() {
    let tbody = d3.select("#movies").select("tbody");
    tbody.html("");
}

// --------------- Event Listeners ----------------------------
function performSearch() {
    let query = d3.select("#searchInput").property("value").toLowerCase();

    let filteredMovies = allMovies.filter(movie => movie.title.toLowerCase().includes(query));

    clearMovies();
    displayMovies(filteredMovies);
}

// Add an event listener to the search button
d3.select("#searchButton").on("click", performSearch);

// Add an event listener to the search input field
d3.select("#searchInput").on("keyup", function (event) {
    if (event.keyCode === 13) {
        performSearch();
        event.preventDefault();
    }
});
