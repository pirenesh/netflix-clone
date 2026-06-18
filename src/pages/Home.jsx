import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests from '../requests';
import MoviePopup from '../components/MoviePopup';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClosePopup = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="relative min-h-screen bg-netflix-black text-white pb-24 overflow-x-hidden">
      {/* Global Navigation */}
      <Navbar />

      {/* Hero Banner Section */}
      <Banner onSelectMovie={handleSelectMovie} />

      {/* Row Categories Sliders */}
      <div className="relative z-10 -mt-16 md:-mt-24 space-y-6">
        <Row 
          title="Trending Now" 
          fetchUrl={requests.fetchTrending} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="trending"
        />
        <Row 
          title="Popular on Netflix" 
          fetchUrl={requests.fetchPopular} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="popular"
        />
        <Row 
          title="Top Rated" 
          fetchUrl={requests.fetchTopRated} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="topRated"
        />
        <Row 
          title="Action Thrillers" 
          fetchUrl={requests.fetchActionMovies} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="action"
        />
        <Row 
          title="Comedies" 
          fetchUrl={requests.fetchComedyMovies} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="comedy"
        />
        <Row 
          title="Scary Movies" 
          fetchUrl={requests.fetchHorrorMovies} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="horror"
        />
        <Row 
          title="Romantic Movies" 
          fetchUrl={requests.fetchRomanceMovies} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="romance"
        />
        <Row 
          title="Documentaries" 
          fetchUrl={requests.fetchDocumentaries} 
          onSelectMovie={handleSelectMovie} 
          mockCategoryKey="documentaries"
        />
      </div>

      {/* Modal Popup Viewer */}
      {selectedMovie && (
        <MoviePopup 
          movie={selectedMovie} 
          onClose={handleClosePopup} 
        />
      )}
    </div>
  );
}
