import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase';
import { AlertCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Prepopulate email from landing query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryEmail = params.get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [location]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      // On success, redirect to Profile Page to select user avatar
      navigate('/profile');
    } catch (err) {
      console.error("Sign up failure:", err);
      let msg = err.message || "Failed to create account.";
      if (msg.includes("auth/email-already-in-use")) {
        msg = "This email is already registered. Please sign in.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Background Poster Cover */}
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-[0.4]" 
        style={{
          backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/d15135d6-c1fd-4c3e-92d3-fc13d57a909e/web/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/80"></div>

      {/* Header Logo */}
      <header className="relative z-10 px-4 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="text-netflix-red font-extrabold text-3xl tracking-tighter hover:scale-105 transition duration-200">
          NETFLIX
        </Link>
      </header>

      {/* Register Form Panel */}
      <main className="relative z-10 w-full max-w-[450px] mx-auto bg-black/75 rounded-lg border border-neutral-900 shadow-2xl p-8 sm:p-16 mb-20">
        <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>

        {!isFirebaseConfigured && (
          <div className="mb-6 bg-netflix-red/10 border border-netflix-red/30 p-3 rounded text-xs text-neutral-300 flex items-start gap-2">
            <AlertCircle size={16} className="text-netflix-red flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white font-sans">Sandbox Registration</span>
              Create any mock account to unlock all features immediately!
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-amber-500/20 border border-amber-500/30 p-3 rounded text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-800 border-b-2 border-transparent focus:border-netflix-red rounded text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-800 border-b-2 border-transparent focus:border-netflix-red rounded text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-netflix-red text-white text-base font-bold rounded hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all mt-4"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-sm text-neutral-400 space-y-4">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline font-semibold">
              Sign In now
            </Link>
          </p>
          <p className="text-xs text-neutral-500 leading-normal">
            By signing up, you agree to our Terms of Use and acknowledge our Privacy Policy.
          </p>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 bg-black/90 border-t border-neutral-900 py-8 px-6 text-xs text-neutral-500 text-center font-medium">
        <p>© {new Date().getFullYear()} Netflix Clone. Developed for display purposes.</p>
      </footer>
    </div>
  );
}
