import React from 'react';
import { Play, Plus, Check, Info } from 'lucide-react';
import { UserAuth } from '../context/AuthContext';

export default function MovieCard({ movie, onSelect }) {
  const { toggleMyList, isInMyList } = UserAuth();
  const isFavorite = isInMyList(movie.id);

  const imageBase = 'https://image.tmdb.org/t/p/w500';
  
  // Use poster_path for taller, more premium poster card layout (similar to Netflix grid lists) 
  // or backdrop_path for standard row layouts. We use backdrop_path if available to match Netflix sliders.
  const imgPath = movie.backdrop_path || movie.poster_path;
  const imageUrl = imgPath 
    ? (imgPath.startsWith('http') ? imgPath : `${imageBase}${imgPath}`)
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400';

  const title = movie.title || movie.name || movie.original_title || movie.original_name;

  return (
    <div className="group relative min-w-[160px] md:min-w-[240px] h-[90px] md:h-[135px] cursor-pointer rounded-md overflow-hidden bg-netflix-dark-gray transition-all duration-300 ease-netflix-ease hover:scale-110 hover:z-30 hover:shadow-xl flex-shrink-0">
      {/* Main image */}
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover group-hover:brightness-50 transition duration-300"
        loading="lazy"
        onClick={() => onSelect(movie)}
      />

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black via-black/40 to-transparent">
        <h4 className="text-white text-xs md:text-sm font-bold truncate mb-2" onClick={() => onSelect(movie)}>
          {title}
        </h4>
        
        <div className="flex items-center gap-2">
          {/* Quick Play (Opens popup with autoplay trailer) */}
          <button 
            onClick={() => onSelect(movie)}
            className="p-1.5 bg-white text-black rounded-full hover:bg-neutral-200 transition"
            title="Play Trailer"
          >
            <Play size={14} fill="currentColor" />
          </button>
          
          {/* Add to List */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMyList(movie);
            }}
            className="p-1.5 bg-netflix-black/80 text-white rounded-full border border-neutral-500 hover:border-white hover:bg-netflix-light-gray transition"
            title={isFavorite ? "Remove from My List" : "Add to My List"}
          >
            {isFavorite ? <Check size={14} className="text-netflix-red" /> : <Plus size={14} />}
          </button>

          {/* Details trigger */}
          <button 
            onClick={() => onSelect(movie)}
            className="p-1.5 bg-netflix-black/80 text-white rounded-full border border-neutral-500 hover:border-white hover:bg-netflix-light-gray transition ml-auto"
            title="More Info"
          >
            <Info size={14} />
          </button>
        </div>

        <div className="flex gap-2 items-center mt-2 text-[10px] font-semibold text-green-500">
          <span>{movie.vote_average ? `${(movie.vote_average * 10).toFixed(0)}% Match` : '95% Match'}</span>
          <span className="text-neutral-400 font-normal px-1 border border-neutral-600 rounded text-[8px] uppercase">HD</span>
        </div>
      </div>
    </div>
  );
}
