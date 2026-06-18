import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MoviePopup from '../components/MoviePopup';
import { UserAuth } from '../context/AuthContext';
import { Play, Film, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isFirebaseConfigured } from '../firebase';

export default function MyList() {
  const { myList } = UserAuth();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-24 overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold">My Saved List</h2>
          {!isFirebaseConfigured && (
            <span className="flex items-center gap-1.5 text-xs text-netflix-red font-semibold bg-netflix-red/10 px-3 py-1 rounded">
              <AlertCircle size={14} /> Local Sandbox Storage
            </span>
          )}
        </div>

        {myList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
            {myList.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onSelect={(m) => setSelectedMovie(m)} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-6 max-w-md mx-auto">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500">
              <Film size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Your List is Empty</h3>
              <p className="text-sm text-neutral-400">
                Tap the '+' icon on any movie or TV show card to add it to your list so you can find it later easily.
              </p>
            </div>
            <Link 
              to="/home" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition"
            >
              <Play size={16} fill="black" /> Explore Titles
            </Link>
          </div>
        )}
      </main>

      {/* Details modal popup */}
      {selectedMovie && (
        <MoviePopup 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
