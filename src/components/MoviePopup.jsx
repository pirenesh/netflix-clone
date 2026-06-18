import React, { useEffect, useState } from 'react';
import { X, Play, Plus, Check, Star, Calendar, Clock, Film } from 'lucide-react';
import { UserAuth } from '../context/AuthContext';
import axios from '../axios';
import requests from '../requests';

export default function MoviePopup({ movie, onClose }) {
  const { toggleMyList, isInMyList } = UserAuth();
  const [trailerKey, setTrailerKey] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const isFavorite = isInMyList(movie.id);
  const title = movie.title || movie.name || movie.original_title || movie.original_name;
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  
  // Image links
  const imageBase = 'https://image.tmdb.org/t/p/original';
  const backdropUrl = movie.backdrop_path 
    ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${imageBase}${movie.backdrop_path}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600';

  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!movie) return;

    // Fetch trailer and details from TMDB
    const fetchMovieData = async () => {
      setLoadingDetails(true);
      setShowTrailer(false);
      setTrailerKey('');
      setSimilarMovies([]);
      setCast([]);

      // If mock movie (has mock trailer), use it
      if (movie.trailer) {
        setTrailerKey(movie.trailer);
        if (movie.similar) setSimilarMovies(movie.similar);
        if (movie.credits?.cast) setCast(movie.credits.cast);
        setLoadingDetails(false);
        return;
      }

      const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
      try {
        const response = await axios.get(requests.fetchMovieDetails(movie.id, mediaType));
        const data = response.data;
        
        // Find official youtube trailer
        const videos = data.videos?.results || [];
        const trailer = videos.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')) || videos[0];
        
        if (trailer) {
          setTrailerKey(`https://www.youtube.com/embed/${trailer.key}`);
        }
        
        // Similar movies
        if (data.similar?.results) {
          setSimilarMovies(data.similar.results.slice(0, 6));
        }

        // Cast
        if (data.credits?.cast) {
          setCast(data.credits.cast.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch TMDB details for modal:", error);
        // Fallback placeholder trailer
        setTrailerKey("https://www.youtube.com/embed/dQw4w9WgXcQ"); // Rick Roll as default fallback or generic trailer
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchMovieData();
  }, [movie]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 overflow-y-auto backdrop-blur-sm p-4 md:p-6 transition-all duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-netflix-dark-gray rounded-xl overflow-hidden shadow-2xl z-10 animate-scale-up my-8 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-netflix-black/60 text-white hover:bg-netflix-red rounded-full transition duration-200"
          aria-label="Close details"
        >
          <X size={24} />
        </button>

        {/* Video Player / Backdrop Top Section */}
        <div className="relative h-[45vw] max-h-[400px] min-h-[240px] bg-black">
          {showTrailer && trailerKey ? (
            <iframe
              src={`${trailerKey}?autoplay=1&mute=0`}
              title="Movie Trailer"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img 
                src={backdropUrl} 
                alt={title} 
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray via-transparent to-black/40"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-[85%]">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-md">
                  {title}
                </h2>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {trailerKey && (
                    <button 
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition duration-200 shadow-md"
                    >
                      <Play size={20} fill="black" /> Play Trailer
                    </button>
                  )}
                  
                  <button 
                    onClick={() => toggleMyList(movie)}
                    className="flex items-center justify-center p-2.5 bg-netflix-black/60 text-white rounded-full border border-neutral-500 hover:border-white hover:bg-netflix-light-gray/40 transition duration-200"
                    title={isFavorite ? "Remove from My List" : "Add to My List"}
                  >
                    {isFavorite ? <Check size={20} className="text-netflix-red" /> : <Plus size={20} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Details Grid Section */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-300">
          {/* Left / Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="text-green-500 flex items-center gap-1 font-bold">
                <Star size={16} fill="currentColor" /> {voteAverage} Rating
              </span>
              
              {releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> {releaseDate.substring(0, 4)}
                </span>
              )}
              
              <span className="px-1.5 py-0.5 border border-neutral-600 rounded text-[10px] uppercase font-bold tracking-wider">
                HD
              </span>
              
              <span className="px-1.5 py-0.5 border border-neutral-600 rounded text-[10px] uppercase font-bold tracking-wider">
                {movie.media_type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-white">
              {movie.overview || "No description available for this title."}
            </p>
          </div>

          {/* Right Column / Metadata */}
          <div className="space-y-4 text-sm border-t md:border-t-0 md:border-l border-neutral-700 pt-6 md:pt-0 md:pl-8">
            {cast.length > 0 && (
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Cast:</span>
                <p className="text-neutral-200 text-xs">
                  {cast.map(c => c.name).join(', ')}
                </p>
              </div>
            )}
            
            {movie.genre_ids && (
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Genres:</span>
                <p className="text-neutral-200 text-xs">
                  {/* Since generic TMDB IDs, we list text descriptors based on common maps or media type */}
                  {movie.genre_ids.map(id => {
                    const genreMap = {
                      28: "Action", 35: "Comedy", 27: "Horror", 10749: "Romance", 99: "Documentary",
                      18: "Drama", 878: "Sci-Fi", 9648: "Mystery", 10765: "Sci-Fi & Fantasy", 12: "Adventure"
                    };
                    return genreMap[id] || "Genre";
                  }).filter(val => val !== "Genre").join(', ') || "Drama, Action"}
                </p>
              </div>
            )}

            <div>
              <span className="text-neutral-500 font-semibold block mb-1">Original Language:</span>
              <p className="text-neutral-200 uppercase text-xs">{movie.original_language || 'en'}</p>
            </div>
          </div>
        </div>

        {/* Similar / Recommended Section */}
        {similarMovies.length > 0 && (
          <div className="px-6 pb-10 md:px-10">
            <h3 className="text-xl font-bold text-white mb-6">More Like This</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {similarMovies.map((similar) => {
                const sTitle = similar.title || similar.name || similar.original_title;
                const sPoster = similar.poster_path 
                  ? (similar.poster_path.startsWith('http') ? similar.poster_path : `${imageBase}${similar.poster_path}`)
                  : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400';
                return (
                  <div 
                    key={similar.id} 
                    className="bg-netflix-dark-gray border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-500 transition duration-300 group cursor-pointer"
                    onClick={() => {
                      // Trigger details load on clicking similar movie
                      setTrailerKey('');
                      setShowTrailer(false);
                      setCast([]);
                      setSimilarMovies([]);
                      // Load details in modal
                      // Since we are in the modal, we can directly select this movie inside this component
                      // by rewriting local component states.
                      movie.id = similar.id;
                      movie.title = similar.title;
                      movie.name = similar.name;
                      movie.backdrop_path = similar.backdrop_path;
                      movie.poster_path = similar.poster_path;
                      movie.overview = similar.overview;
                      movie.vote_average = similar.vote_average;
                      movie.release_date = similar.release_date;
                      movie.first_air_date = similar.first_air_date;
                      movie.media_type = similar.media_type;
                      movie.genre_ids = similar.genre_ids;
                      // Update modal
                      setTrailerKey('');
                    }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={sPoster} 
                        alt={sTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-xs font-semibold text-green-500 flex items-center gap-0.5">
                        <Star size={12} fill="currentColor" /> {similar.vote_average ? similar.vote_average.toFixed(1) : '6.5'}
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="font-semibold text-sm truncate text-white">{sTitle}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">{similar.overview}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
