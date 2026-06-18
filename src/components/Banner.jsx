import React, { useEffect, useState } from 'react';
import { Play, Info, AlertCircle } from 'lucide-react';
import axios from '../axios';
import requests from '../requests';
import SkeletonLoader from './SkeletonLoader';
import { MOCK_MOVIES } from '../mockData';

export default function Banner({ onSelectMovie }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBannerMovie = async () => {
      setLoading(true);
      setError(false);
      try {
        const fetchUrl = requests.fetchNetflixOriginals;
        if (!fetchUrl) {
          // No API key configured
          if (isMounted) {
            const mockOriginals = MOCK_MOVIES.trending;
            const randomMovie = mockOriginals[Math.floor(Math.random() * mockOriginals.length)];
            setMovie(randomMovie);
            setLoading(false);
          }
          return;
        }

        const request = await axios.get(fetchUrl);
        const results = request.data.results || [];
        
        if (results.length > 0) {
          // Select a random movie from originals list
          const randomIndex = Math.floor(Math.random() * results.length);
          if (isMounted) {
            setMovie(results[randomIndex]);
          }
        } else {
          // Fallback to trending mock
          if (isMounted) {
            setMovie(MOCK_MOVIES.trending[0]);
          }
        }
      } catch (err) {
        console.error("Banner fetching error, falling back to mock data:", err);
        if (isMounted) {
          setError(true);
          // Fallback to local mock
          const mockOriginals = MOCK_MOVIES.trending;
          const randomMovie = mockOriginals[Math.floor(Math.random() * mockOriginals.length)];
          setMovie(randomMovie);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBannerMovie();

    return () => {
      isMounted = false;
    };
  }, []);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  };

  if (loading) {
    return <SkeletonLoader type="banner" />;
  }

  if (!movie) return null;

  const imageBase = 'https://image.tmdb.org/t/p/original';
  const backdropUrl = movie.backdrop_path 
    ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${imageBase}${movie.backdrop_path}`)
    : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600';

  const title = movie.title || movie.name || movie.original_name;

  return (
    <header 
      className="relative w-full h-[56.25vw] max-h-[800px] min-h-[450px] bg-netflix-black text-white object-contain flex flex-col justify-center select-none"
      style={{
        backgroundImage: `url("${backdropUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      {/* Visual Overlay: dark gradient to hide bright headers and frame titles */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent hero-overlay"></div>

      {/* Content */}
      <div className="relative z-10 pl-6 md:pl-12 max-w-[85%] sm:max-w-[60%] md:max-w-[45%] flex flex-col gap-3 md:gap-4 justify-center mt-12 md:mt-0">
        
        {error && (
          <div className="inline-flex items-center gap-1.5 self-start bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-3 py-1 rounded text-xs font-semibold">
            <AlertCircle size={14} /> TMDB Offline Mode
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-wide drop-shadow-lg leading-tight">
          {title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-neutral-300 drop-shadow-md font-medium leading-relaxed">
          {truncate(movie.overview, 160)}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={() => onSelectMovie(movie)}
            className="flex items-center gap-2 px-5 py-2 md:px-7 md:py-3 bg-white text-black font-bold text-sm md:text-base rounded hover:bg-neutral-200 transition duration-200 shadow-md"
          >
            <Play size={18} fill="black" /> Play
          </button>

          <button 
            onClick={() => onSelectMovie(movie)}
            className="flex items-center gap-2 px-5 py-2 md:px-7 md:py-3 bg-netflix-light-gray/60 hover:bg-netflix-light-gray/90 text-white font-bold text-sm md:text-base rounded transition duration-200 backdrop-blur-sm shadow-md"
          >
            <Info size={18} /> More Info
          </button>
        </div>
      </div>

      {/* bottom fade gradient to row list */}
      <div className="banner-fadeBottom absolute bottom-0 left-0 right-0"></div>
    </header>
  );
}
