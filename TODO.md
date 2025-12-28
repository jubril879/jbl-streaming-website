# TODO: Replace Homepage Images with OMDB API Data

## Plan
- Modify HeroSection.jsx to fetch movie data from OMDB API and use the 'Poster' field as the background image instead of the hardcoded '/dark-dramatic-movie-scene.jpg'.
- Modify MovieCarousel.jsx to fetch the movie data and replace the hardcoded MOVIES array with the fetched movie data (display the single movie from API in the carousel).

## Steps
- [ ] Edit HeroSection.jsx: Add useEffect to fetch from http://www.omdbapi.com/?i=tt3896198&apikey=ddcc93bd, use movie.Poster as background image.
- [ ] Edit MovieCarousel.jsx: Add useEffect to fetch the same API, replace MOVIES array with [fetchedMovie] (adapted to match the expected structure).
