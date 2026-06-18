import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Plus, Check, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from '../axios';
import requests from '../requests';
import { getMockMovieDetails } from '../mockData';
import { UserAuth } from '../context/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';

export default function MovieDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { toggleMyList, isInMyList } = UserAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [similar, setSimilar] = useState([]);
  
  const isFavorite = movie ? isInMyList(movie.id) : false;

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      setTrailerKey('');
      setShowPlayer(false);

      // Check if ID matches local mock first
      const mockDetails = getMockMovieDetails(id);
      if (mockDetails) {
        if (isMounted) {
          setMovie(mockDetails);
          setTrailerKey(mockDetails.trailer);
          setSimilar(mockDetails.similar || []);
          setLoading(false);
        }
        return;
      }

      try {
        const fetchUrl = requests.fetchMovieDetails(id, type || 'movie');
        const response = await axios.get(fetchUrl);
        const data = response.data;
        
        if (isMounted) {
          setMovie(data);
          
          // Find trailer key
          const videos = data.videos?.results || [];
          const officialTrailer = videos.find(
            vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
          ) || videos[0];

          if (officialTrailer) {
            setTrailerKey(`https://www.youtube.com/embed/${officialTrailer.key}`);
          }
          
          // Similar items
          setSimilar(data.similar?.results?.slice(0, 6) || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load details page:", err);
        // Direct fallbacks if movie not found
        if (isMounted) {
          setMovie({
            id: parseInt(id),
            title: "Unknown Title",
            overview: "Could not retrieve details for this movie. Check your internet connection or API settings.",
            vote_average: 0
          });
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-t-netflix-red border-neutral-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-neutral-400 font-semibold">Loading Cinematic Details...</p>
      </div>
    );
  }

  const title = movie.title || movie.name || movie.original_title;
  const imageBase = 'https://image.tmdb.org/t/p/original';
  const backdropUrl = movie.backdrop_path 
    ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${imageBase}${movie.backdrop_path}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600';

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-24 overflow-x-hidden">
      <Navbar />

      {/* Hero Watch Panel */}
      <div className="relative w-full h-[60vw] max-h-[600px] min-h-[360px] bg-black">
        {showPlayer && trailerKey ? (
          <iframe
            src={`${trailerKey}?autoplay=1&mute=0`}
            title="Cinematic Player"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            <img 
              src={backdropUrl} 
              alt={title} 
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-black/30"></div>
            
            <div className="absolute top-24 left-6 md:left-12 z-20">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-netflix-red rounded text-sm text-white font-medium transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>

            <div className="absolute bottom-12 left-6 md:left-12 max-w-[80%] space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-md">
                {title}
              </h1>

              <div className="flex items-center gap-3">
                {trailerKey && (
                  <button 
                    onClick={() => setShowPlayer(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-extrabold rounded-md hover:bg-neutral-200 transition shadow-lg"
                  >
                    <Play size={20} fill="black" /> Play Trailer
                  </button>
                )}
                
                <button 
                  onClick={() => toggleMyList(movie)}
                  className="flex items-center justify-center p-3 bg-neutral-900/80 rounded-full border border-neutral-600 hover:border-white transition"
                  title={isFavorite ? "Remove from List" : "Add to List"}
                >
                  {isFavorite ? <Check size={20} className="text-netflix-red" /> : <Plus size={20} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info details body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left main info */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
            <span className="text-green-500 font-bold flex items-center gap-1">
              <Star size={16} fill="currentColor" /> {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'} rating
            </span>
            <span>{movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4)}</span>
            <span className="px-1.5 py-0.5 border border-neutral-700 rounded text-xs uppercase font-bold">HD</span>
            <span className="capitalize">{type || 'movie'}</span>
          </div>

          <p className="text-lg md:text-xl text-white leading-relaxed font-light">
            {movie.overview || "No description overview is currently available."}
          </p>
        </div>

        {/* Right metadata panel */}
        <div className="bg-netflix-dark-gray/50 border border-neutral-800 rounded-lg p-6 space-y-4 text-sm text-neutral-400">
          {movie.genres && (
            <div>
              <span className="text-neutral-500 font-bold block mb-1">Genres:</span>
              <p className="text-neutral-200">{movie.genres.map(g => g.name).join(', ')}</p>
            </div>
          )}

          {movie.production_companies && (
            <div>
              <span className="text-neutral-500 font-bold block mb-1">Studio:</span>
              <p className="text-neutral-200">{movie.production_companies.map(c => c.name).slice(0,2).join(', ')}</p>
            </div>
          )}

          <div>
            <span className="text-neutral-500 font-bold block mb-1">Status:</span>
            <p className="text-neutral-200">{movie.status || 'Released'}</p>
          </div>
        </div>
      </main>

      {/* Recommendations rows */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Titles Similar To This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {similar.map(item => {
              const itemTitle = item.title || item.name;
              const itemPoster = item.poster_path 
                ? (item.poster_path.startsWith('http') ? item.poster_path : `${imageBase}${item.poster_path}`)
                : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400';
              return (
                <Link 
                  key={item.id} 
                  to={`/watch/${item.title ? 'movie' : 'tv'}/${item.id}`}
                  className="bg-netflix-dark-gray border border-neutral-800 hover:border-neutral-500 rounded overflow-hidden transition duration-300 group"
                >
                  <img src={itemPoster} alt={itemTitle} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300" />
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-white truncate">{itemTitle}</h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
