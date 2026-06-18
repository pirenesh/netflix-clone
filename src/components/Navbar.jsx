import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { UserAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logOut, currentProfile } = UserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for sticky solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update search input when location query changes
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
      setShowSearch(true);
    } else {
      setSearchQuery('');
      setShowSearch(false);
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate('/home');
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 ease-in-out ${isScrolled || showMobileMenu ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Left Section: Logo & Nav links */}
        <div className="flex items-center gap-8">
          <Link to={user ? "/home" : "/"} className="text-netflix-red font-extrabold text-2xl md:text-3xl tracking-tighter hover:scale-105 transition duration-200">
            NETFLIX
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
              <Link to="/home" className={`hover:text-white transition duration-200 ${location.pathname === '/home' ? 'text-white font-semibold' : ''}`}>Home</Link>
              <Link to="/mylist" className={`hover:text-white transition duration-200 ${location.pathname === '/mylist' ? 'text-white font-semibold' : ''}`}>My List</Link>
              <Link to="/profile" className={`hover:text-white transition duration-200 ${location.pathname === '/profile' ? 'text-white font-semibold' : ''}`}>Profile</Link>
            </div>
          )}
        </div>

        {/* Right Section: Search, Bell, Dropdown */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <button
                  type="button"
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-1.5 hover:text-neutral-300 text-white transition duration-200"
                  aria-label="Toggle search input"
                >
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Titles, people, genres..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`bg-black/80 text-white border border-neutral-600 rounded text-sm px-3 py-1 ml-2 transition-all duration-300 focus:outline-none focus:border-white ${showSearch ? 'w-40 sm:w-60 opacity-100 scale-100' : 'w-0 opacity-0 scale-95 pointer-events-none'}`}
                />
              </form>

              {/* Notification Bell */}
              <button className="hidden sm:block p-1.5 hover:text-neutral-300 text-white transition duration-200 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-netflix-red w-2 h-2 rounded-full"></span>
              </button>

              {/* Active Profile Trigger & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 focus:outline-none"
                  aria-label="Profile options dropdown"
                >
                  <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="w-8 h-8 rounded-md object-cover border border-neutral-700 hover:border-white transition"
                  />
                  <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile menu dropdown content */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-netflix-dark-gray border border-neutral-800 rounded-lg shadow-xl py-2 z-50 animate-scale-up">
                    <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-2">
                      <img src={currentProfile.avatar} alt="avatar" className="w-6 h-6 rounded object-cover" />
                      <span className="text-white text-xs font-semibold truncate">{currentProfile.name}</span>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                    >
                      <User size={14} /> Account Profiles
                    </Link>
                    
                    <Link 
                      to="/mylist" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                    >
                      <Bell size={14} /> My Saved List
                    </Link>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogoutClick();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-netflix-red hover:bg-neutral-800 transition text-left"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Burger Menu */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-1.5 hover:text-neutral-300 text-white transition duration-200"
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}

          {!user && location.pathname !== '/login' && location.pathname !== '/signup' && (
            <Link
              to="/login"
              className="bg-netflix-red text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-red-700 transition duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown drawer */}
      {showMobileMenu && user && (
        <div className="md:hidden bg-netflix-black border-b border-neutral-800 px-4 py-4 space-y-3">
          <Link 
            to="/home" 
            onClick={() => setShowMobileMenu(false)}
            className={`block py-2 text-sm text-neutral-300 hover:text-white transition ${location.pathname === '/home' ? 'text-white font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/mylist" 
            onClick={() => setShowMobileMenu(false)}
            className={`block py-2 text-sm text-neutral-300 hover:text-white transition ${location.pathname === '/mylist' ? 'text-white font-semibold' : ''}`}
          >
            My List
          </Link>
          <Link 
            to="/profile" 
            onClick={() => setShowMobileMenu(false)}
            className={`block py-2 text-sm text-neutral-300 hover:text-white transition ${location.pathname === '/profile' ? 'text-white font-semibold' : ''}`}
          >
            Manage Profiles
          </Link>
        </div>
      )}
    </nav>
  );
}
