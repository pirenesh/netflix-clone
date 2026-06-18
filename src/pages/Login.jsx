import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logIn } = UserAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await logIn(email, password);
      navigate('/home');
    } catch (err) {
      console.error("Login failure:", err);
      // Clean up error message for user display
      let msg = err.message || "Failed to sign in.";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password")) {
        msg = "Incorrect email or password. Please try again.";
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

      {/* Login Card */}
      <main className="relative z-10 w-full max-w-[450px] mx-auto bg-black/75 rounded-lg border border-neutral-900 shadow-2xl p-8 sm:p-16 mb-20">
        <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
        
        {/* Mock mode warning */}
        {!isFirebaseConfigured && (
          <div className="mb-6 bg-netflix-red/10 border border-netflix-red/30 p-3 rounded text-xs text-neutral-300 flex items-start gap-2">
            <AlertCircle size={16} className="text-netflix-red flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">Local Sandbox Mode</span>
              Any email/password combination will work if you sign up first!
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-amber-500/20 border border-amber-500/30 p-3 rounded text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email or phone number"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-800 border-b-2 border-transparent focus:border-amber-500 rounded text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-zinc-800 border-b-2 border-transparent focus:border-amber-500 rounded text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-netflix-red text-white text-base font-bold rounded hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all mt-4"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-xs text-neutral-400">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="accent-netflix-red" />
            Remember me
          </label>
          <span className="hover:underline cursor-pointer">Need help?</span>
        </div>

        <div className="mt-8 text-sm text-neutral-400 space-y-4">
          <p>
            New to Netflix?{' '}
            <Link to="/signup" className="text-white hover:underline font-semibold">
              Sign up now
            </Link>
          </p>
          <p className="text-xs text-neutral-500 leading-normal">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <span className="text-blue-500 hover:underline cursor-pointer">Learn more.</span>
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
