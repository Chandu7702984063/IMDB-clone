const API_KEY = 'da8df181';
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const favoriteMoviesList = document.getElementById('favoriteMovies');
const favoriteMovies = [];

searchInput.addEventListener('input', debounce(handleSearch, 300));

function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length === 0) {
        suggestions.innerHTML = '';
        return;
    }

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const results = data.results;
            suggestions.innerHTML = '';
            results.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('suggestion');
                movieItem.innerHTML = `
                    <h3>${movie.title}</h3>
                    <button onclick="addToFavorites(${movie.id}, '${movie.title}')">Add to Favorites</button>
                    <button onclick="showMovieDetails(${movie.id})">Details</button>
                `;
                suggestions.appendChild(movieItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addToFavorites(movieId, movieTitle) {
    if (!favoriteMovies.find(item => item.id === movieId)) {
        favoriteMovies.push({ id: movieId, title: movieTitle });
        updateFavoritesList();
    }

    // Check if the added movie is "Bahubali" and add it to favorites
    if (movieTitle === "Bahubali") {
        const bahubaliMovieId = 12345; // Replace with the actual movie ID
        if (!favoriteMovies.find(item => item.id === bahubaliMovieId)) {
            favoriteMovies.push({ id: bahubaliMovieId, title: "Bahubali" });
            updateFavoritesList();
        }
    }
}

function updateFavoritesList() {
    favoriteMoviesList.innerHTML = '';
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `${movie.title} <button onclick="removeFromFavorites(${movie.id})">Remove</button>`;
        favoriteMoviesList.appendChild(li);
    });
}

function removeFromFavorites(movieId) {
    const index = favoriteMovies.findIndex(item => item.id === movieId);
    if (index !== -1) {
        favoriteMovies.splice(index, 1);
        updateFavoritesList();
    }
}

function showMovieDetails(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(movie => {
            const movieDetails = document.getElementById('movieDetails');
            movieDetails.innerHTML = `
                <h2>${movie.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.overview}</p>
                <p>Release Date: ${movie.release_date}</p>
                <p>Vote Average: ${movie.vote_average}</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
