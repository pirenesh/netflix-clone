import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MoviePopup from '../components/MoviePopup';
import SkeletonLoader from '../components/SkeletonLoader';
import axios from '../axios';
import requests from '../requests';
import { searchMockMovies } from '../mockData';
import { AlertCircle } from 'lucide-react';

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    let isMounted = true;
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const fetchUrl = requests.searchMovies(query);
        if (!fetchUrl) {
          // No API key -> Fallback to mock search
          if (isMounted) {
            setMovies(searchMockMovies(query));
            setLoading(false);
          }
          return;
        }

        const response = await axios.get(fetchUrl);
        const results = (response.data.results || []).filter(
          item => item.backdrop_path || item.poster_path
        );

        if (isMounted) {
          setMovies(results);
          setLoading(false);
        }
      } catch (err) {
        console.error("Search API failed, loading mock results:", err);
        if (isMounted) {
          setError(true);
          setMovies(searchMockMovies(query));
          setLoading(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Debounce queries for smoother Typing UX

    return () => {
      clearTimeout(delayDebounceFn);
      isMounted = false;
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-24 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Search Results for <span className="text-neutral-400">"{query}"</span>
          </h2>
          {error && (
            <span className="flex items-center gap-1.5 text-xs text-netflix-red font-semibold bg-netflix-red/10 px-3 py-1 rounded">
              <AlertCircle size={14} /> Offline Mock Search
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="aspect-video bg-netflix-dark-gray rounded animate-pulse"></div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onSelect={(m) => setSelectedMovie(m)} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
            <p className="text-lg text-neutral-400">
              Your search for "{query}" did not find any matches.
            </p>
            <div className="text-sm text-neutral-500 max-w-md">
              Suggestions:
              <ul className="list-disc list-inside mt-2 text-left space-y-1">
                <li>Try different keywords</li>
                <li>Looking for a movie or TV show? Try "Stranger Things", "Wednesday", or "The Gray Man"</li>
                <li>Try searching for a genre, like action, comedy, or horror</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {selectedMovie && (
        <MoviePopup 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
