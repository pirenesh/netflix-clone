import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Edit2, Plus, ArrowLeft, LogOut, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user, logOut, currentProfile, changeProfile } = UserAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentProfile.name);
  
  // Set up mock profile avatars (Netflix styles colors)
  const profilesList = [
    {
      id: 1,
      name: 'Adult',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // Blue avatar
    },
    {
      id: 2,
      name: 'Kids',
      avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150', // Yellow/green avatar
    },
    {
      id: 3,
      name: 'Action Fan',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', // Red/purple avatar
    },
    {
      id: 4,
      name: 'Movie Lover',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', // Pink/orange avatar
    }
  ];

  const handleSelectProfile = (profile) => {
    changeProfile(profile);
    setEditName(profile.name);
    setIsEditing(false);
    // Navigate home after profile selection
    navigate('/home');
  };

  const handleSaveProfileName = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      changeProfile({
        ...currentProfile,
        name: editName
      });
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-24 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-32 w-full flex-grow flex flex-col justify-center items-center">
        
        {!isEditing ? (
          <div className="text-center space-y-10 animate-fade-in">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-wide">
              Who's watching?
            </h1>

            {/* Profile Grid Cards */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {profilesList.map((prof) => (
                <div 
                  key={prof.id} 
                  className="group flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => handleSelectProfile(prof)}
                >
                  <div className="relative">
                    <img 
                      src={prof.avatar} 
                      alt={prof.name} 
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-md object-cover border-2 hover:scale-105 transition-all duration-300 ${currentProfile.id === prof.id ? 'border-white' : 'border-transparent group-hover:border-neutral-400'}`}
                    />
                    {currentProfile.id === prof.id && (
                      <div className="absolute -top-2 -right-2 bg-netflix-red p-1 rounded-full text-white shadow-md border border-black">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                  <span className="text-sm md:text-base text-neutral-400 group-hover:text-white transition font-medium">
                    {prof.id === currentProfile.id ? currentProfile.name : prof.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Manage Profiles Trigger */}
            <div className="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 border border-neutral-500 text-neutral-400 hover:text-white hover:border-white text-sm md:text-base font-semibold transition tracking-wide uppercase"
              >
                Manage Profiles
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-6 py-2 bg-netflix-red text-white hover:bg-red-700 text-sm md:text-base font-semibold transition tracking-wide uppercase"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-netflix-dark-gray/60 border border-neutral-800 rounded-lg p-6 sm:p-10 space-y-6 animate-scale-up">
            <div className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer" onClick={() => setIsEditing(false)}>
              <ArrowLeft size={18} /> <span className="text-sm font-semibold">Back to Selector</span>
            </div>

            <h2 className="text-2xl font-bold">Edit Profile</h2>

            <form onSubmit={handleSaveProfileName} className="space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src={currentProfile.avatar} 
                  alt="avatar" 
                  className="w-16 h-16 rounded object-cover border border-neutral-700"
                />
                <div className="flex-grow">
                  <label htmlFor="profile-name-input" className="text-xs text-neutral-500 font-bold block mb-1">PROFILE NAME</label>
                  <input 
                    id="profile-name-input"
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    maxLength={15}
                    placeholder="Enter Profile Name"
                    className="w-full bg-zinc-800 px-4 py-2 text-white border-b-2 border-transparent focus:border-netflix-red focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500 mb-2">ACCOUNT DETAILS</p>
                <div className="bg-zinc-800/40 p-3.5 rounded border border-neutral-800">
                  <p className="text-xs text-neutral-400">Registered Email Address:</p>
                  <p className="text-sm text-white font-medium truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button 
                  type="submit"
                  className="flex-grow py-2 bg-white text-black hover:bg-neutral-200 text-sm font-semibold rounded transition"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-grow py-2 border border-neutral-600 text-neutral-400 hover:text-white hover:border-white text-sm font-semibold rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-6 text-center text-xs text-neutral-600 pt-16">
        <p>© {new Date().getFullYear()} Netflix Clone. Prepared for browser demonstrations.</p>
      </footer>
    </div>
  );
}
