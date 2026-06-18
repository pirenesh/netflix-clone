const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopular: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  searchMovies: (query) => `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&include_adult=false`,
  fetchMovieDetails: (id, type = 'movie') => `/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,similar,credits`,
};

export default requests;
