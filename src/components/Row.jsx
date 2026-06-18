import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import axios from '../axios';
import MovieCard from './MovieCard';
import SkeletonLoader from './SkeletonLoader';
import { MOCK_MOVIES } from '../mockData';

export default function Row({ title, fetchUrl, onSelectMovie, mockCategoryKey }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMovies = async () => {
      setLoading(true);
      setError(false);
      
      try {
        if (!fetchUrl) {
          // If no TMDB URL is provided, fall back to mock database directly
          if (isMounted) {
            setMovies(MOCK_MOVIES[mockCategoryKey] || []);
            setLoading(false);
          }
          return;
        }

        const request = await axios.get(fetchUrl);
        if (isMounted) {
          setMovies(request.data.results || []);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching category '${title}':`, err);
        // Fallback to local mock data on API failure
        if (isMounted) {
          setMovies(MOCK_MOVIES[mockCategoryKey] || []);
          setError(true);
          // Set loading to false since we are displaying fallback data
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [fetchUrl, title, mockCategoryKey]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollOffset = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 py-4 pl-4 md:pl-12">
        <h3 className="text-lg md:text-2xl font-bold text-white uppercase tracking-wider">{title}</h3>
        <SkeletonLoader type="card" count={6} />
      </div>
    );
  }

  // If error occurred and no mock movies available
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="relative space-y-1 py-4 pl-4 md:pl-12 group/row">
      <div className="flex items-center gap-2">
        <h3 className="text-lg md:text-2xl font-bold text-white hover:text-neutral-300 cursor-pointer transition duration-200">
          {title}
        </h3>
        {error && (
          <span 
            className="flex items-center gap-1 text-xs text-netflix-red font-semibold bg-netflix-red/10 px-2 py-0.5 rounded"
            title="TMDB API failed. Showing local mock database fallbacks."
          >
            <AlertCircle size={12} /> Local Mock
          </span>
        )}
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute top-0 bottom-0 left-0 z-40 items-center justify-center w-10 md:w-12 bg-black/60 text-white hover:bg-black/85 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden sm:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft size={32} className="hover:scale-125 transition" />
        </button>

        {/* Horizontal Slider Content */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2 row-posters"
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onSelect={onSelectMovie} 
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute top-0 bottom-0 right-0 z-40 items-center justify-center w-10 md:w-12 bg-black/60 text-white hover:bg-black/85 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden sm:flex"
          aria-label="Scroll right"
        >
          <ChevronRight size={32} className="hover:scale-125 transition" />
        </button>
      </div>
    </div>
  );
}
