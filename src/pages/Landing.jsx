import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const handleRegisterRedirect = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      navigate('/signup');
    }
  };

  const faqs = [
    {
      q: "What is Netflix?",
      a: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price."
    },
    {
      q: "How much does Netflix cost?",
      a: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $22.99 a month. No extra costs, no contracts."
    },
    {
      q: "Where can I watch?",
      a: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles."
    },
    {
      q: "How do I cancel?",
      a: "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
    },
    {
      q: "What can I watch on Netflix?",
      a: "Netflix has an extensive library of feature movies, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want."
    },
    {
      q: "Is Netflix good for kids?",
      a: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-[0.4]" 
        style={{
          backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/d15135d6-c1fd-4c3e-92d3-fc13d57a909e/web/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/85"></div>

      {/* Navbar wrapper */}
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto flex-grow pt-32 pb-16">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium mb-6">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-8 max-w-2xl">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Email registration call-to-action */}
        <form onSubmit={handleRegisterRedirect} className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full flex-grow px-5 py-4 bg-black/60 border border-neutral-600 rounded text-white text-base focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 bg-netflix-red text-white text-lg font-bold rounded hover:bg-red-700 active:scale-95 transition-all flex-shrink-0"
          >
            Get Started <ChevronRight size={22} />
          </button>
        </form>
      </div>

      {/* Spacer border line */}
      <div className="h-2 w-full bg-zinc-800 z-10"></div>

      {/* FAQ Accordion Section */}
      <div className="relative z-10 bg-black py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-netflix-dark-gray hover:bg-zinc-800 rounded transition duration-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left text-lg sm:text-xl md:text-2xl font-medium focus:outline-none"
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.q}</span>
                  {activeFaq === index ? <Minus size={28} /> : <Plus size={28} />}
                </button>
                
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-black/20 ${activeFaq === index ? 'max-h-[500px] p-5 sm:p-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 space-y-4">
            <p className="text-sm sm:text-base md:text-lg">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <form onSubmit={handleRegisterRedirect} className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full flex-grow px-5 py-4 bg-black/60 border border-neutral-600 rounded text-white text-base focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 bg-netflix-red text-white text-lg font-bold rounded hover:bg-red-700 active:scale-95 transition-all flex-shrink-0"
              >
                Get Started <ChevronRight size={22} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 bg-black border-t border-zinc-800 py-12 px-6 text-xs text-neutral-400 font-medium">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="hover:underline cursor-pointer">Questions? Call 1-800-892-0000</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <span className="hover:underline cursor-pointer">FAQ</span>
            <span className="hover:underline cursor-pointer">Help Center</span>
            <span className="hover:underline cursor-pointer">Account</span>
            <span className="hover:underline cursor-pointer">Media Center</span>
            <span className="hover:underline cursor-pointer">Investor Relations</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
            <span className="hover:underline cursor-pointer">Ways to Watch</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Cookie Preferences</span>
            <span className="hover:underline cursor-pointer">Corporate Information</span>
            <span className="hover:underline cursor-pointer">Contact Us</span>
          </div>
          <p>© {new Date().getFullYear()} Netflix Clone. Created for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
